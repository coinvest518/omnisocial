import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import getStripe from '../lib/get-stripe';

// Define the Stripe prices (replace these with your actual Stripe price IDs)
const pricingData = [
  { 
    plan: 'Basic', 
    cost: 5, 
    credits: 10, 
    maxClicksGPT35: 75, 
    maxClicksGPT4: '-', 
    aiModelAccess: 'GPT-3.5',
    priceId: 'price_1QJpyBE4H116aDHAL0Vdn9YU' 
  },
  { 
    plan: 'Standard', 
    cost: 10, 
    credits: 25, 
    maxClicksGPT35: 187, 
    maxClicksGPT4: 10, 
    aiModelAccess: 'GPT-3.5, GPT-4',
    priceId: 'price_1QJqI3E4H116aDHANJG3IRkI' 
  },
  { 
    plan: 'Pro', 
    cost: 20, 
    credits: 55, 
    maxClicksGPT35: 412, 
    maxClicksGPT4: 20, 
    aiModelAccess: 'GPT-4',
    priceId: 'price_1QJyuxE4H116aDHA1ZMZb3En' 
  },
  { 
    plan: 'Enterprise', 
    cost: 50, 
    credits: 150, 
    maxClicksGPT35: 1125, 
    maxClicksGPT4: 50, 
    aiModelAccess: 'GPT-4, premium features',
    priceId: 'price_1QJyvPE4H116aDHAvXoqxqrH' 
  }
];

interface ComponentProps {
  onClose: () => void;
}

export default function SubscriptionModal({ onClose }: ComponentProps) {
  const [selectedPlan, setSelectedPlan] = useState('Basic');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure this component only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Open Stripe Checkout Session
  const handleCheckout = async (priceId: string, planName: string) => {
    if (!isClient) return; // Ensure this runs only on the client side

    setIsLoading(true);
    try {
      const response = await fetch(`${window.location.origin}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, planName }),
      });

      if (!response.ok) {
        console.error(`API call failed with status ${response.status}: ${response.statusText}`);
        const errorDetails = await response.text();
        console.error('API Error details:', errorDetails);
        setIsLoading(false);
        return;
      }


      const data = await response.json();
      console.log('API response data:', data);

      const  sessionId  = data?.sessionId;


      if (!sessionId) {
        console.error('Failed to retrieve a sessionId from the server response.');
        setIsLoading(false);
        return;
      }

      const stripe = await getStripe();
      if (!stripe) {
        console.error('Failed to initialize Stripe.');
        setIsLoading(false);
        return;
      }

      const stripeResult = await stripe.redirectToCheckout({ sessionId });
      if (stripeResult?.error) {
        console.error('Stripe checkout error:', stripeResult.error.message);
      }
    } catch (error) {
      console.error('Error during Stripe checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Avoid rendering on the server
  if (!isClient) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto relative bg-white rounded-lg shadow-md"> 
      <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Choose Your Plan</CardTitle>
        <CardDescription className="text-center">Select the plan that best fits your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPlan} onValueChange={setSelectedPlan}>
          <TabsList className="grid w-full grid-cols-4">
            {pricingData.map((plan) => (
              <TabsTrigger key={plan.plan} value={plan.plan}>
                {plan.plan}
              </TabsTrigger>
            ))}
          </TabsList>
          {pricingData.map((plan) => (
            <TabsContent key={plan.plan} value={plan.plan}>
              <div className="mt-4 text-center">
                <h3 className="text-3xl font-bold">${plan.cost}</h3>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <ul className="mt-4 space-y-2">
                <li>Credits: {plan.credits}</li>
                <li>Max Clicks (GPT-3.5): {plan.maxClicksGPT35}</li>
                <li>Max Clicks (GPT-4): {plan.maxClicksGPT4}</li>
                <li>AI Model Access: {plan.aiModelAccess}</li>
              </ul>
              <Button 
                className="mt-4 w-full" 
                onClick={() => handleCheckout(plan.priceId, plan.plan)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : `Subscribe to ${plan.plan}`}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
        <p className="mt-4 text-center">You have selected the: {selectedPlan} plan</p>
      </CardContent>
    </Card>
  );
}
