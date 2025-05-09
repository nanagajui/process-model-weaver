
import { Button } from '@/components/ui/button';
import { hasApiKey } from '@/services/openai';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  onShowApiKey: () => void;
}

const Header = ({ onShowApiKey }: HeaderProps) => {
  const apiKeySet = hasApiKey();

  return (
    <header className="border-b pb-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-bpmn-blue">BPMN Generator</h1>
          <p className="text-muted-foreground">
            Generate BPMN diagrams from natural language descriptions
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={apiKeySet ? "secondary" : "default"}
                onClick={onShowApiKey}
                className="shrink-0"
              >
                {apiKeySet ? 'API Key ✓' : 'Set API Key'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{apiKeySet ? 'Update your OpenAI API key' : 'Set your OpenAI API key to enable generation'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
