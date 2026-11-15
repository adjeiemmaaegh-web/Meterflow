// Production runtime bridge. Build with esbuild so React 19 and ReactDOM
// are included in the self-contained PWA, not fetched from an external CDN.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
const roots=new WeakMap();
window.React=React;
window.ReactDOM={render(node,container){
  if(!container)throw Error('MeterFlow root element is missing.');
  let root=roots.get(container);
  if(!root){root=createRoot(container);roots.set(container,root);}
  root.render(node);
}};
