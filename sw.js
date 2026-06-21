// Service worker mínimo — solo habilita la instalación como app.
// No cachea datos en vivo (jugadores/asistencia) para que siempre estén actualizados.
const CACHE = 'af-entrenador-v1';
const SHELL = ['/'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Solo intercepta navegación al shell; todo lo demás (datos, fuentes, etc.) va directo a la red.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
  }
});
