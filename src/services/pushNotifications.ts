export class PushNotificationService {
  private static vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HuWukzpOCmnLRuJAGSKOTdtDB5VEJi5wjcJVRc1XKnP7QGYaXqiD7xGVJo';

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return false;
    }

    if (!('serviceWorker' in navigator)) {
      console.log('Este navegador no soporta service workers');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.subscribeToPush();
        return true;
      }
    }

    return false;
  }

  static async subscribeToPush(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Aquí podrías enviar la suscripción a tu servidor
      console.log('Push subscription:', subscription);
      
      // Guardar en localStorage para uso posterior
      localStorage.setItem('pushSubscription', JSON.stringify(subscription));
    } catch (error) {
      console.error('Error al suscribirse a push notifications:', error);
    }
  }

  static async sendNotification(title: string, body: string, data?: any): Promise<void> {
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      
      registration.showNotification(title, {
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data,
        actions: [
          {
            action: 'view',
            title: 'Ver Pedido'
          },
          {
            action: 'close',
            title: 'Cerrar'
          }
        ],
        requireInteraction: true,
        silent: false
      });
    }
  }

  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}