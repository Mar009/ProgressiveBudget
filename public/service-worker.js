//Consts
const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";


const CACHED_URLS = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

//performs the install
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Opened the Cache");
            return Cache.addAll(CACHED_URLS);
        })
    )
});


//get the API routes
self.addEventListener("fetch", function (event) {
    if (event.request.url.incluces("/api")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(event.request);
                    });
            }).catch(err => console.log(err))
        );
        return;
    }
    //returns the chached home pg for all of the requests for html pgs
    event.respondWith(
        fetch(event.request).catch(function(){
            return caches.match(event.request).then(function(response){
                if (response){
                    return response;
                } else if (event.request.headers.get("accept").includes("text/html")){
                    return caches.match("/");
                }
            });
        })
    );
});
