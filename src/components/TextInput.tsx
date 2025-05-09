
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextInputProps {
  onSubmit: (text: string, enhance: boolean) => void;
  disabled: boolean;
  loading: boolean;
}

const TextInput = ({ onSubmit, disabled, loading }: TextInputProps) => {
  const [text, setText] = useState('');
  const [enhance, setEnhance] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text, enhance);
    }
  };

  const sampleProcess = "A customer submits an order. The system checks stock and ships it if available. If not, notify the customer and reorder stock.";

  const useSampleText = () => {
    setText(sampleProcess);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Process Description</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the business process here..."
            className="min-h-[150px] mb-4"
            disabled={disabled || loading}
          />
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="enhance-text"
                checked={enhance}
                onCheckedChange={setEnhance}
                disabled={disabled || loading}
              />
              <Label htmlFor="enhance-text">Enhance description before generation</Label>
            </div>
            
            <Button 
              variant="outline" 
              type="button" 
              onClick={useSampleText}
              disabled={disabled || loading}
            >
              Use Sample Process
            </Button>
          </div>
          
          <Button 
            type="submit"
            disabled={disabled || loading || !text.trim()}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate BPMN'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TextInput;
