
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Download } from 'lucide-react';
import { downloadBPMN } from '@/services/bpmnUtils';
import { toast } from 'sonner';

interface XmlViewerProps {
  xml: string;
}

const XmlViewer = ({ xml }: XmlViewerProps) => {
  const [showXml, setShowXml] = useState(false);

  const handleDownload = () => {
    downloadBPMN(xml);
    toast.success('BPMN file downloaded');
  };

  if (!xml) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>BPMN XML</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowXml(!showXml)}>
            {showXml ? 'Hide XML' : 'Show XML'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showXml && (
          <div className="max-h-[400px] overflow-y-auto">
            <SyntaxHighlighter
              language="xml"
              style={docco}
              className="text-xs rounded-md"
              wrapLines={true}
            >
              {xml}
            </SyntaxHighlighter>
          </div>
        )}
        {!showXml && (
          <div className="text-center text-muted-foreground p-4">
            Click "Show XML" to view the generated BPMN XML
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default XmlViewer;
