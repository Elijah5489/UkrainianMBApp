// Ukrainian Winnipeg App - Service Worker

const CACHE_NAME = 'ukrainian-winnipeg-v1';
const STATIC_CACHE_NAME = 'ukrainian-winnipeg-static-v1';
const API_CACHE_NAME = 'ukrainian-winnipeg-api-v1';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/static/css/styles.css',
  '/static/js/app.js',
  '/static/js/translator.js',
  '/static/js/lessons.js',
  '/static/manifest.json',
  '/translator',
  '/lessons',
  '/community',
  '/heritage',
  '/events',
  '/resources',
  // External CDN assets (cached when accessed)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://unpkg.com/feather-icons'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/translations'
];

// URLs that should always be fetched from network
const NETWORK_ONLY = [
  '/admin',
  '/search'
];

// ===== INSTALLATION =====
self.addEventListener('install', function(event) {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then(function(cache) {
        console.log('Service Worker: Caching static assets...');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      }),
      
      // Cache API responses
      caches.open(API_CACHE_NAME).then(function(cache) {
        console.log('Service Worker: Preparing API cache...');
        return Promise.resolve();
      })
    ]).then(function() {
      console.log('Service Worker: Installation complete');
      // Take control immediately
      return self.skipWaiting();
    }).catch(function(error) {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// ===== ACTIVATION =====
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(function() {
      console.log('Service Worker: Activation complete');
    }).catch(function(error) {
      console.error('Service Worker: Activation failed', error);
    })
  );
});

// ===== FETCH HANDLING =====
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// ===== REQUEST HANDLERS =====

function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  // Network first strategy for API requests
  return fetch(request)
    .then(function(response) {
      // Cache successful responses
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(API_CACHE_NAME).then(function(cache) {
          cache.put(request, responseClone);
        });
      }
      return response;
    })
    .catch(function() {
      // Fallback to cache if network fails
      return caches.match(request).then(function(cachedResponse) {
        if (cachedResponse) {
          console.log('Service Worker: Serving API request from cache', request.url);
          return cachedResponse;
        }
        
        // Return offline API response for translations
        if (url.pathname === '/api/translations') {
          return new Response(JSON.stringify([
            {
              id: 1,
              ukrainian: "Допоможіть!",
              english: "Help!",
              pronunciation: "Do-po-mo-zheet",
              category: "emergency"
            },
            {
              id: 2,
              ukrainian: "Дякую",
              english: "Thank you",
              pronunciation: "Dya-ku-yu",
              category: "greetings"
            },
            {
              id: 3,
              ukrainian: "Привіт",
              english: "Hello",
              pronunciation: "Pry-veet",
              category: "greetings"
            }
          ]), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          });
        }
        
        throw new Error('No cached response available');
      });
    });
}

function handleStaticAsset(request) {
  // Cache first strategy for static assets
  return caches.match(request).then(function(cachedResponse) {
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch from network and cache
    return fetch(request).then(function(response) {
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(STATIC_CACHE_NAME).then(function(cache) {
          cache.put(request, responseClone);
        });
      }
      return response;
    });
  });
}

function handleNavigationRequest(request) {
  // Network first for navigation, fallback to offline page
  return fetch(request)
    .then(function(response) {
      if (response.ok) {
        // Cache successful page responses
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, responseClone);
        });
      }
      return response;
    })
    .catch(function() {
      // Try to serve from cache
      return caches.match(request).then(function(cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fallback to cached homepage for navigation
        return caches.match('/').then(function(homeResponse) {
          if (homeResponse) {
            return homeResponse;
          }
          
          // Ultimate fallback - offline page
          return createOfflinePage();
        });
      });
    });
}

function handleGenericRequest(request) {
  // Generic cache-first strategy
  return caches.match(request).then(function(cachedResponse) {
    return cachedResponse || fetch(request).then(function(response) {
      if (response.ok) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, responseClone);
        });
      }
      return response;
    });
  });
}

// ===== UTILITY FUNCTIONS =====

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  const pathname = url.pathname.toLowerCase();
  
  return staticExtensions.some(ext => pathname.endsWith(ext)) || 
         pathname.startsWith('/static/') ||
         url.hostname !== self.location.hostname; // External resources
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isNetworkOnlyRequest(url) {
  return NETWORK_ONLY.some(pattern => url.pathname.startsWith(pattern));
}

function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Ukrainian Winnipeg</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #e8f4f8 0%, #ffffff 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #343a40;
            }
            .container {
                text-align: center;
                max-width: 500px;
                background: white;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            .icon {
                font-size: 64px;
                margin-bottom: 20px;
                color: #1a5f7a;
            }
            h1 {
                color: #1a5f7a;
                margin-bottom: 20px;
                font-size: 28px;
            }
            p {
                color: #6c757d;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .btn {
                background: #1a5f7a;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                font-weight: 500;
                transition: background 0.3s ease;
            }
            .btn:hover {
                background: #0f3a4a;
            }
            .offline-features {
                margin-top: 30px;
                text-align: left;
            }
            .offline-features h3 {
                color: #1a5f7a;
                font-size: 18px;
                margin-bottom: 15px;
            }
            .offline-features ul {
                list-style: none;
                padding: 0;
            }
            .offline-features li {
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .offline-features li:last-child {
                border-bottom: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>No internet connection detected. Don't worry - you can still access some features of Ukrainian Winnipeg!</p>
            
            <div class="offline-features">
                <h3>Available Offline:</h3>
                <ul>
                    <li>✓ Cached translation phrases</li>
                    <li>✓ Previously viewed lessons</li>
                    <li>✓ Saved community information</li>
                    <li>✓ Basic app navigation</li>
                </ul>
            </div>
            
            <button class="btn" onclick="window.location.reload()">Try Again</button>
        </div>
        
        <script>
            // Auto-reload when connection is restored
            window.addEventListener('online', function() {
                window.location.reload();
            });
        </script>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' },
    status: 200
  });
}

// ===== MESSAGE HANDLING =====
self.addEventListener('message', function(event) {
  const { action } = event.data;
  
  switch (action) {
    case 'skipWaiting':
      self.skipWaiting();
      break;
      
    case 'clearCache':
      event.waitUntil(
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
              return caches.delete(cacheName);
            })
          );
        }).then(function() {
          event.ports[0].postMessage({ success: true });
        })
      );
      break;
      
    case 'getCacheInfo':
      event.waitUntil(
        caches.keys().then(function(cacheNames) {
          const cacheInfo = {};
          return Promise.all(
            cacheNames.map(function(cacheName) {
              return caches.open(cacheName).then(function(cache) {
                return cache.keys().then(function(keys) {
                  cacheInfo[cacheName] = keys.length;
                });
              });
            })
          ).then(function() {
            event.ports[0].postMessage({ cacheInfo });
          });
        })
      );
      break;
      
    default:
      console.log('Service Worker: Unknown message action', action);
  }
});

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', function(event) {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-translations') {
    event.waitUntil(syncTranslations());
  }
});

function syncTranslations() {
  // Sync translations when connection is restored
  return fetch('/api/translations')
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Sync failed');
    })
    .then(function(data) {
      return caches.open(API_CACHE_NAME).then(function(cache) {
        return cache.put('/api/translations', new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        }));
      });
    })
    .catch(function(error) {
      console.error('Service Worker: Translation sync failed', error);
    });
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', function(event) {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New update available!',
    icon: '/static/manifest.json', // This will use the icon from manifest
    badge: '/static/manifest.json',
    tag: data.tag || 'default',
    requireInteraction: false,
    actions: data.actions || [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Ukrainian Winnipeg', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Script loaded successfully');
