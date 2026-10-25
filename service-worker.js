/* Maarifa App - Service Worker (offline-first) */
const VER='maarifa-v3',IMG='maarifa-img-v1',SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VER&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VER).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html').then(h=>h||caches.match('./'))));return}
 if(u.origin===location.origin){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VER).then(c=>c.put(r,cp))}return res})));return}
 if(u.hostname==='images.unsplash.com'){e.respondWith(caches.open(IMG).then(c=>c.match(r).then(h=>h||fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>h))));return}
});

self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return self.clients.openWindow('./index.html')}))});


