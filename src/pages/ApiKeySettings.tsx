
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiKey, setApiKey } from '@/services/openai';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ApiKeySettings = () => {
  const [key, setKey] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(!!getApiKey());

  useEffect(() => {
    // Check if key exists in local storage
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setKey(storedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    setApiKey(key);
    // Store in localStorage for persistence
    localStorage.setItem('openai_api_key', key);
    setIsSaved(true);
    toast.success('API key saved successfully!');
    // Show saved state feedback
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Process Builder
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">API Key Settings</h1>
        </div>
        
        <div className="max-w-2xl mx-auto p-6 border border-border rounded-lg bg-card shadow-sm">
          <h2 className="text-xl font-medium mb-4">OpenAI API Key</h2>
          
          <p className="text-muted-foreground mb-6">
            Your OpenAI API key is required to use the BPMN generation features. 
            The key is stored securely in your browser's local storage and is not sent to any server.
          </p>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-..."
                className="flex-grow"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowKey(!showKey)}
                type="button"
                className="shrink-0"
              >
                {showKey ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={handleSave}
                className="shrink-0"
                disabled={!key || key.trim() === ''}
              >
                Save
              </Button>
            </div>
            
            {isSaved && (
              <p className="text-sm text-green-600">API key saved successfully!</p>
            )}

            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-2">Security Information</h3>
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                <li>Your API key is stored only in your browser's local storage</li>
                <li>It is not sent to any server except OpenAI's API</li>
                <li>You can clear it anytime by clearing your browser data</li>
                <li>Ensure you're using this application on a secure device</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
