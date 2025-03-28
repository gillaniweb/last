import { useEffect } from 'react';
import PushNotificationSubscribe from '../components/PushNotificationSubscribe';
import { useScrollToTop } from '../lib/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryToolbar from '@/components/CategoryToolbar';

export default function NotificationsPage() {
  const scrollToTop = useScrollToTop();
  
  useEffect(() => {
    scrollToTop();
    document.title = 'Notification Settings - GNN';
  }, [scrollToTop]);

  return (
    <>
      <Header />
      <CategoryToolbar />
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
          <p className="text-muted-foreground mb-8">
            Manage how you receive news alerts and breaking stories
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
              <PushNotificationSubscribe />
            </section>
            
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-2">About Notifications</h2>
              <div className="space-y-4 text-sm">
                <p>
                  Push notifications allow you to receive breaking news and important updates directly on your device, 
                  even when you're not browsing our website.
                </p>
                <p>
                  You can customize which categories of news you'd like to receive notifications for, 
                  or unsubscribe at any time.
                </p>
                <p>
                  <strong>Privacy Note:</strong> Your notification subscription is stored securely and will only be used 
                  to send you the news alerts you've requested. Your browsing data is not collected through this service.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}