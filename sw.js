const CACHE='mimori-v2';
const ASSETS=['./','./index.html','./css/styles.css','./js/app.js','./js/storage.js','./js/timer.js','./js/tasks.js','./js/subjects.js','./js/cards.js','./js/attendance.js','./js/calendar.js','./js/buddy.js','./js/buddyDialogue.js','./js/water.js','./js/pomodoro.js','./js/gamification.js','./js/notifications.js','./manifest.webmanifest','./assets/logo/mimori-logo.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});

self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});

// Network-first: always try to get the latest version when online.
// Only fall back to the cached copy if the network request fails (offline).
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return r;
    }).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html')))
  );
});

self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
