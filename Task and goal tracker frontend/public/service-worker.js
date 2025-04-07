self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Notification', message: 'You have a new notification!' };
    
    const options = {
        body: data.message,
        icon: '/notification-icon.png',
        badge: '/notification-badge.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
