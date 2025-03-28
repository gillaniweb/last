import { useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  Bell, 
  BellOff,
  Check,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Category } from '../../../shared/schema';

export default function PushNotificationSubscribe() {
  const { 
    isLoading,
    isSupported, 
    isSubscribed, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch categories data
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubscribe = async () => {
    if (isSubscribed) {
      setIsSubmitting(true);
      try {
        const success = await unsubscribe();
        if (success) {
          setSelectedCategories([]);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (Notification.permission === 'denied') {
        toast({
          title: 'Permission Denied',
          description: 'Please enable notifications permission in your browser settings.',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);
      try {
        await subscribe(selectedCategories);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Not supported message
  if (!isSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Not Supported
          </CardTitle>
          <CardDescription>
            Your browser does not support push notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Push notifications require a modern browser that supports Service Workers and the Web Push API.
            Please consider upgrading your browser to receive news updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Loading notification preferences...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? (
            <>
              <Bell className="h-5 w-5 text-green-500" />
              <span>Notifications Enabled</span>
            </>
          ) : (
            <>
              <BellOff className="h-5 w-5" />
              <span>Enable News Alerts</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isSubscribed 
            ? "You're receiving news alerts. Manage your preferences below."
            : "Get breaking news and top stories delivered to your device."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isSubscribed && (
          <div className="space-y-4">
            <div className="rounded-md bg-primary-foreground/30 p-4 mb-4">
              <h4 className="font-medium mb-2">Select News Categories</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which categories you'd like to receive notifications for, or leave all unchecked to receive all updates.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {Array.isArray(categories) && categories.map((category: Category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={() => handleCategoryToggle(category.slug)}
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isSubscribed && (
          <div className="rounded-md bg-green-50 dark:bg-green-950/30 p-4 mb-4 flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm">
              You are currently receiving push notifications for 
              {selectedCategories.length > 0 
                ? ` ${selectedCategories.join(', ')} news.`
                : ' all news categories.'}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSubscribe}
          disabled={isSubmitting}
          className="w-full"
          variant={isSubscribed ? "outline" : "default"}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubscribed ? "Unsubscribe from notifications" : "Subscribe to notifications"}
        </Button>
      </CardFooter>
    </Card>
  );
}