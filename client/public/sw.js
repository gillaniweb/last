// Service Worker for Push Notifications
self.addEventListener('push', event => {
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.svg', // Path to icon in public folder
      badge: '/icon-72x72.svg',  // Path to badge icon in public folder
      data: {
        url: data.url || '/'     // URL to open when notification is clicked
      }
    };

    // Show notification
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
    // If JSON parsing fails, show a generic notification
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification from GNN',
        icon: '/icon-192x192.svg',
        badge: '/icon-72x72.svg'
      })
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Get the URL to open from notification data or default to homepage
  const urlToOpen = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : '/';

  // Open the URL in a new window/tab
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});

// Service worker installation
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Service worker activation
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});