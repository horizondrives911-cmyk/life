const CACHE='life-time-v52';
const FILES=['life-time.html','life-time-manifest.json','life-time-192.png','life-time-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  const name=u.pathname.split('/').pop();
  if(!FILES.includes(name))return;
  e.respondWith(
    caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
      const net=fetch(r).then(res=>{if(res&&res.ok)c.put(name,res.clone());return res}).catch(()=>hit);
      return hit||net;
    }))
  );
});
