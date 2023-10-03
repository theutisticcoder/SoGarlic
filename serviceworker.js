var nme = "sogarlic-v1"
const assets = [
	"index.html",
	"garlic.jpg"
];
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(nme).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})