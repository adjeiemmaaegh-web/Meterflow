import {createServer} from 'node:http';
import fs from 'node:fs';import path from 'node:path';
const dir=path.resolve('dist'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json'};
const port=Number(process.env.PORT)||4173;
const server=createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url||'/',`http://127.0.0.1:${port}`).pathname);
  const filepath=path.resolve(dir,'.'+(pathname==='/'?'/index.html':pathname));
  if(!filepath.startsWith(dir+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(filepath,(err,data)=>{
    if(err){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(filepath)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
  });
});server.listen(port,'127.0.0.1',()=>console.log(`MeterFlow preview: http://127.0.0.1:${port}`));
