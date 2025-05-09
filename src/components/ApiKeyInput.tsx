
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiKey, setApiKey } from '@/services/openai';
import { Check, X } from 'lucide-react';

const ApiKeyInput = () => {
  const [key, setKey] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(!!getApiKey());

  const handleSave = () => {
    setApiKey(key);
    setIsSaved(true);
    // Add visual feedback for saved state
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="mb-4 p-4 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-medium mb-2">OpenAI API Key</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Enter your OpenAI API key to enable BPMN generation.
        Your key remains in your browser and is not sent to any server.
      </p>
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
        >
          Save
        </Button>
      </div>
      {isSaved && (
        <p className="text-sm text-green-600 mt-2">API key saved successfully!</p>
      )}
    </div>
  );
};

export default ApiKeyInput;
