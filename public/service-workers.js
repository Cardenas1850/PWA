const { response } = require("express");
const { cache } = require("webpack");

const CACHE_NAME = "static_cache";
const DATA_CACHE = "data_cache";

const CACHE_FILES = [
    '/',
    '/indes.html',
    '/style.css',
    '/js/index.js',
    '/js/idb.js',
    'public\icons\icon-72x72.png',
    'public\icons\icon-96x96.png',
    'public\icons\icon-128x128.png',
    'public\icons\icon-144x144.png',
    'public\icons\icon-152x152.png',
    'public\icons\icon-192x192.png',
    'public\icons\icon-384x384.png',
    'public\icons\icon-512x512.png'
];

// install the service worker

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES);
        })
    );
    self.skipWaiting();
});

// start service worker and clear cache at install
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
            keyList.map((key) => {
                if (key !== CACHE_NAME && key !== DATA_CACHE) {
                    return caches.delete(key);
                }
            })
        );
    })
    );
    self.clients.claim();
});

//fetch and get requests

self.addEventListener("fetch", event => {
    if(event.request.url.includes("/api/") && event.request.method === "GET") { //aoi request
        event.respondWith(
            caches.open(DATA_CACHE).then((cache) => {
                return fetch(e.request)
                .then((response) => {
                    if (response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                })
                .catch(() => {
                    return.cache.match(event.request);
                });
            })
            .cache((err) => console.log(err))
        );
        return;
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});