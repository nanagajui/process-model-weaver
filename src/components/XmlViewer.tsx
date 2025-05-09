
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Download } from 'lucide-react';
import { downloadBPMN } from '@/services/bpmnUtils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface XmlViewerProps {
  xml: string;
  onUpdate?: (updatedXml: string) => void;
}

const XmlViewer = ({ xml, onUpdate }: XmlViewerProps) => {
  const [showXml, setShowXml] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editableXml, setEditableXml] = useState(xml);

  // Update editableXml when the xml prop changes (if not editing)
  if (xml !== editableXml && !editing) {
    setEditableXml(xml);
  }

  const handleDownload = () => {
    downloadBPMN(editableXml);
    toast.info('BPMN file preview opened in a new tab (download functionality temporarily disabled)');
  };

  const handleEdit = () => {
    setEditing(true);
    setShowXml(true); // Always show XML when editing
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editableXml);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditableXml(xml); // Reset to original XML
    setEditing(false);
  };

  if (!xml) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>BPMN XML</CardTitle>
        <div className="flex space-x-2">
          {!editing && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowXml(!showXml)}>
                {showXml ? 'Hide XML' : 'Show XML'}
              </Button>
              {onUpdate && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  Edit XML
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> Preview
              </Button>
            </>
          )}
          {editing && (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showXml && !editing && (
          <div className="max-h-[400px] overflow-y-auto">
            <SyntaxHighlighter
              language="xml"
              style={docco}
              className="text-xs rounded-md"
              wrapLines={true}
            >
              {editableXml}
            </SyntaxHighlighter>
          </div>
        )}
        {showXml && editing && (
          <Textarea
            value={editableXml}
            onChange={(e) => setEditableXml(e.target.value)}
            className="font-mono text-xs h-[400px]"
          />
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
