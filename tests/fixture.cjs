// Entirely synthetic fixture. No original private apartment history is bundled.
const patterns={A:['G01','101'],B:['101','102'],C:['G01','401'],D:['108','208'],E:['G01','101'],F:['G01','101'],G:['G01','401']};
const apartments=[];
for(const [block,nums] of Object.entries(patterns)){
 for(const [k,number] of nums.entries()){
  const readings=[];let value=1000+block.charCodeAt(0)*12+k*50;
  for(let i=0;i<30;i++){
   if(i>0)value+=(i+k)%3===0?0:1;
   readings.push({date:new Date(Date.UTC(2026,8,26+i)).toISOString().slice(0,10),value});
  }
  apartments.push({id:`${block}:${number}`,block,number,type:'Synthetic',readings});
 }
}
module.exports={kind:'meterflow-dataset',schemaVersion:1,name:'Synthetic engineering fixture',apartments};
