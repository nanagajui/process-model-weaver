
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface EnhancedResultProps {
  originalText: string;
  enhancedText: string;
}

const EnhancedResult = ({ originalText, enhancedText }: EnhancedResultProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Enhanced Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-1">Original Text:</h4>
            <SyntaxHighlighter
              language="text"
              style={docco}
              className="text-sm rounded-md"
            >
              {originalText}
            </SyntaxHighlighter>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-1">Enhanced Text:</h4>
            <SyntaxHighlighter
              language="text"
              style={docco}
              className="text-sm rounded-md"
            >
              {enhancedText}
            </SyntaxHighlighter>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedResult;
