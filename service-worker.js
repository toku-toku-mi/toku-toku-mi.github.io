const CACHE_NAME = 'quiz-derby-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];
// インストール時
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  // 即座に新しいSWを有効化
  self.skipWaiting();
});
// リクエスト時
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
// アップデート時：古いキャッシュを全部削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 既存のページにも即適用
  );
});
