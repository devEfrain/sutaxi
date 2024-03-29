//asignar un nombre y versión al cache

var cacheName = "app-sutaxi-v1";
var appShellFiles = [
  './assets/css/alpha/alpha.css',
  './assets/css/alpha/alpha_cc.css',
  './assets/css/ui.sutx.css',
  './assets/js/genesis.js',
  './assets/js/engine.sutx.js',
  './assets/leaflet/leaflet.css',
  './assets/leaflet/leaflet.js',
  './assets/leaflet/Leaflet.CheapLayerAt.js',
  './assets/modules/json/config.json',
  './assets/modules/json/lang.json',
  './assets/modules/json/rates.json',
  './assets/modules/json/zones.json',
  './assets/modules/static/config.html',
  './assets/modules/static/hotel.html',
  './assets/modules/static/info.html',
  './assets/modules/static/main.html',
  './assets/modules/static/map.html',
  './assets/modules/static/services.html',
  './assets/src/img/arrow_down.png',
  './assets/src/img/card1_cover.jpg',
  './assets/src/img/card1_img.jpg',
  './assets/src/img/card2_cover.jpg',
  './assets/src/img/card2_img.jpg',
  './assets/src/img/card3_cover.jpg',
  './assets/src/img/card3_img.jpg',
  './assets/src/img/card4_cover.jpg',
  './assets/src/img/card4_img.jpg',
  './assets/src/img/card5_cover.jpg',
  './assets/src/img/card5_img.jpg',
  './assets/src/img/card6_cover.jpg',
  './assets/src/img/card6_img.jpg',
  './assets/src/img/card7_img.jpg',
  './assets/src/img/card8_cover.jpg',
  './assets/src/img/card8_img.jpg',
  './assets/src/img/picker.png',
  './assets/src/svg/city.svg',
  './assets/src/svg/config.svg',
  './assets/src/svg/home.svg',
  './assets/src/svg/hotel.svg',
  './assets/src/svg/info.svg',
  './assets/src/svg/logo.svg',
  './assets/src/svg/options.svg',
  './assets/src/svg/phone.svg',
  './assets/src/svg/services.svg',
  './assets/src/svg/whatsapp.svg',
  './favicon.png'
];

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(appShellFiles);
      })
      .catch((err) => console.log('SW: ', err))
  )
});

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  // const cacheWhitelist = [CACHING_TARIFARIO]

  e.waitUntil(
    caches.keys()
      .then((arrCatch) => {
        return Promise.all(
          arrCatch.map((index) => {
            //Eliminamos lo que ya no se necesita en cache
            if(index !== appShellFiles) {
              return caches.delete(index)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
});

// //cuando el navegador recupera una url
// self.addEventListener('fetch', (e) => {
//   //Responder ya sea con el objeto en caché o continuar y buscar la url real
//   e.respondWith(
//     caches.match(e.request)
//       .then((res) => {
//         // recuperar del caché o de la url
//         console.log(res, e.request.url)
//         return fetch(e.request.url) || res;
//       })
//   )
// });

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Servicio Worker] Obteniendo recurso: '+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
          console.log('[Servicio Worker] Almacena el nuevo recurso: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
