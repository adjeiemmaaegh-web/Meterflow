/** Offline-safe exports of persisted, confirmed meter readings only.
 * No forecast/suggestion fields, draft edits, user notes or audit data appear in the document. */
namespace MeterFinalExport {
  export interface Row { apartmentNumber:string; finalReading:number; }

  /** Read the authoritative actual for the given date; never fall back to a predicted value. */
  export function confirmedRows(session:BlockSession,apartments:Apartment[],overrides:Override[]):Row[] {
    if (session.status!=='confirmed') throw Error('Only confirmed saved blocks can be exported. Confirm the block first.');
    // Validates one row per apartment and the session's date/block and identity mapping.
    MeterDaily.validateRows(session.rows,apartments,session.date,session.block);
    const byId=new Map(apartments.map(a=>[a.id,a]));
    const actualOverrides=new Map(overrides.filter(o=>o.date===session.date).map(o=>[o.apartmentId,o.value]));
    return MeterDaily.sortApartments(session.rows).map(row=>{
      const a=byId.get(row.apartmentId);
      if(!a||a.block!==session.block||a.number!==row.number)throw Error('Saved apartment identity mismatch. Export cancelled.');
      const base=a.readings.find(r=>r.date===session.date);
      const actual=actualOverrides.has(a.id)?actualOverrides.get(a.id):base?.value;
      if(actual===undefined||!Number.isSafeInteger(actual)||actual<0||actual>1e9){
        throw Error(`No valid saved final meter reading for apartment ${row.number}. Export cancelled to avoid including a forecast.`);
      }
      if(!/^[A-Za-z0-9][A-Za-z0-9 ._\-/]*$/.test(a.number)) throw Error(`Apartment ${a.number} has unsupported characters for PDF/JPEG export.`);
      return {apartmentNumber:a.number,finalReading:actual};
    });
  }

  export function filename(session:BlockSession,format:'pdf'|'jpeg'):string {
    if(session.status!=='confirmed'||!MeterEngine.validDate(session.date)||!(/^[A-G]$/).test(session.block))throw Error('Invalid confirmed block.');
    return `meterflow-block-${session.block}-${session.date}-final-readings.${format==='pdf'?'pdf':'jpg'}`;
  }

  const formatValue=(n:number)=>String(n); // Plain whole-number meter reading; no forecast calculations.
  const pdfText=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');

  /** Text-based, searchable A4 PDF; no external PDF service, font, or library. */
  export function toPdf(rows:Row[]):Blob {
    if(!rows.length) throw Error('There are no confirmed readings to export.');
    // The compact PDF draws the same two columns on as many pages as necessary.
    const perPage=32;
    const pages:string[]=[];
    for(let offset=0;offset<rows.length;offset+=perPage){
      const chunk=rows.slice(offset,offset+perPage);
      const cmds=[
        '0.12 0.27 0.30 rg',
        `BT /F2 12 Tf 44 796 Td (${pdfText('Apartment number')}) Tj ET`,
        `BT /F2 12 Tf 308 796 Td (${pdfText('Final meter reading')}) Tj ET`,
        '0.72 0.79 0.78 RG 0.8 w 42 784 m 552 784 l S'
      ];
      for(let i=0;i<chunk.length;i++){
        const y=759-i*22;
        cmds.push('0.09 0.23 0.25 rg',
          `BT /F1 11 Tf 44 ${y} Td (${pdfText(chunk[i].apartmentNumber)}) Tj ET`,
          `BT /F1 11 Tf 308 ${y} Td (${formatValue(chunk[i].finalReading)}) Tj ET`,
          '0.88 0.91 0.91 RG 0.4 w',`42 ${y-8} m 552 ${y-8} l S`);
      }
      pages.push(cmds.join('\n')+'\n');
    }
    const enc=new TextEncoder();
    const objects:string[]=['',
      '<< /Type /Catalog /Pages 2 0 R >>',
      '',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
    ];
    const pageIds:number[]=[];
    for(const content of pages){
      const contentId=objects.length;
      objects.push(`<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream`);
      const pageId=objects.length;
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
      pageIds.push(pageId);
    }
    objects[2]=`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(n=>`${n} 0 R`).join(' ')}] >>`;
    // Build byte-accurate PDF object offsets, including after multiple pages.
    const segments:string[]=['%PDF-1.4\n'];
    const offsets:number[]=[0];
    let bytes=enc.encode(segments[0]).length;
    for(let n=1;n<objects.length;n++){
      offsets.push(bytes);
      const object=`${n} 0 obj\n${objects[n]}\nendobj\n`;
      segments.push(object);bytes+=enc.encode(object).length;
    }
    const xref=bytes;
    let trailer=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
    for(let n=1;n<objects.length;n++)trailer+=`${String(offsets[n]).padStart(10,'0')} 00000 n \n`;
    trailer+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    segments.push(trailer);
    return new Blob(segments,{type:'application/pdf'});
  }

  /** Single lossless-layout JPEG image of a single block, compatible with phone photo viewers. */
  export async function toJpeg(rows:Row[]):Promise<Blob> {
    if(!rows.length)throw Error('There are no confirmed readings to export.');
    const canvas=document.createElement('canvas');
    const width=1000,rowHeight=49,top=89,height=top+rows.length*rowHeight+28;
    // Cap canvas size to avoid blank JPG files on memory-limited mobile browsers.
    if(height>4096)throw Error('Too many readings for a single JPEG. Export blocks individually or use PDF.');
    canvas.width=width;canvas.height=height;
    const g=canvas.getContext('2d');
    if(!g)throw Error('JPEG export is not supported by this browser. Use PDF instead.');
    g.fillStyle='#ffffff';g.fillRect(0,0,width,height);
    g.fillStyle='#123b40';g.font='bold 25px Arial, sans-serif';
    g.fillText('Apartment number',38,59);g.fillText('Final meter reading',530,59);
    g.fillStyle='#d0dbdb';g.fillRect(32,72,width-64,2);
    for(let i=0;i<rows.length;i++){
      const y=top+i*rowHeight;
      if(i%2===0){g.fillStyle='#f2f7f5';g.fillRect(32,y-4,width-64,rowHeight);}
      g.fillStyle='#183d40';g.font='24px Arial, sans-serif';
      g.fillText(rows[i].apartmentNumber,41,y+29);
      g.fillText(formatValue(rows[i].finalReading),539,y+29);
    }
    return await new Promise<Blob>((resolve,reject)=>{
      canvas.toBlob(blob=>blob&&blob.size>0?resolve(blob):reject(Error('JPEG image creation failed. Please use PDF.')),'image/jpeg',0.94);
    });
  }
}
