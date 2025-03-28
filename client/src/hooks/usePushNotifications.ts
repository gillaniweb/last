import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY || null;

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the browser supports service workers and push notifications
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setIsSupported(false);
      setIsLoading(false);
      return;
    }

    const initialize = async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        setRegistration(registration);

        // Check if already subscribed
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
        setSubscription(subscription);
      } catch (error) {
        console.error('Error initializing push notifications:', error);
        toast({
          title: 'Push Notification Error',
          description: 'Failed to initialize push notifications.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [toast]);

  const subscribe = async (categories: string[] = []) => {
    if (!registration || !publicVapidKey) {
      toast({
        title: 'Subscription Error',
        description: 'Unable to subscribe. Service worker not registered.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setIsLoading(true);

      // First, get the server's public VAPID key
      const response = await fetch('/api/push/vapidPublicKey');
      const { publicKey } = await response.json();

      // Convert the VAPID key to a Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // Send subscription to the server
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          p256dh: getP256dhKey(subscription),
          auth: getAuthKey(subscription),
          categories,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to send subscription to server');
      }

      setIsSubscribed(true);
      setSubscription(subscription);
      
      toast({
        title: 'Success!',
        description: 'You have successfully subscribed to push notifications.',
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: 'Subscription Error',
        description: error instanceof Error ? error.message : 'Failed to subscribe to push notifications.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) {
      toast({
        title: 'Unsubscribe Error',
        description: 'No subscription found to unsubscribe from.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsLoading(true);

      // Unsubscribe from the browser
      await subscription.unsubscribe();

      // Remove subscription from the server
      const res = await fetch('/api/push/unsubscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to unsubscribe on server');
      }

      setIsSubscribed(false);
      setSubscription(null);
      
      toast({
        title: 'Success!',
        description: 'You have successfully unsubscribed from push notifications.',
      });

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: 'Unsubscribe Error',
        description: error instanceof Error ? error.message : 'Failed to unsubscribe from push notifications.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
  
    return outputArray;
  };

  const getP256dhKey = (subscription: PushSubscription): string => {
    const json = subscription.toJSON();
    return json.keys?.p256dh || '';
  };

  const getAuthKey = (subscription: PushSubscription): string => {
    const json = subscription.toJSON();
    return json.keys?.auth || '';
  };

  return {
    isSupported,
    isLoading,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe,
  };
}