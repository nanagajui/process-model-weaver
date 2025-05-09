
import { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { downloadBPMN, downloadSVG } from '@/services/bpmnUtils';
import { Download, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface BpmnViewerProps {
  bpmnXml: string;
}

const BpmnViewer = ({ bpmnXml }: BpmnViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bpmnViewerRef = useRef<any>(null);
  const [currentScale, setCurrentScale] = useState(1.0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the BPMN viewer if not already initialized
    if (!bpmnViewerRef.current) {
      bpmnViewerRef.current = new BpmnJS({
        container: containerRef.current,
      });

      // Add event listener for import.done
      bpmnViewerRef.current.on('import.done', (event: any) => {
        if (event.error) {
          toast.error('Error rendering the BPMN diagram');
          return;
        }

        const canvas = bpmnViewerRef.current.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
        setCurrentScale(1.0);
      });
    }

    // Import the BPMN diagram
    if (bpmnXml && bpmnViewerRef.current) {
      try {
        bpmnViewerRef.current.importXML(bpmnXml);
      } catch (error) {
        console.error('Error importing BPMN XML:', error);
        toast.error('Failed to render BPMN diagram');
      }
    }

    // Clean up function
    return () => {
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
        bpmnViewerRef.current = null;
      }
    };
  }, [bpmnXml]);

  const zoomIn = () => {
    if (!bpmnViewerRef.current) return;
    const newScale = currentScale + 0.1;
    const canvas = bpmnViewerRef.current.get('canvas');
    canvas.zoom(newScale);
    setCurrentScale(newScale);
  };

  const zoomOut = () => {
    if (!bpmnViewerRef.current) return;
    const newScale = Math.max(0.1, currentScale - 0.1);
    const canvas = bpmnViewerRef.current.get('canvas');
    canvas.zoom(newScale);
    setCurrentScale(newScale);
  };

  const handleDownloadBPMN = () => {
    downloadBPMN(bpmnXml);
    toast.success('BPMN file downloaded');
  };

  const handleDownloadSVG = () => {
    if (!containerRef.current) return;
    
    // Find the SVG element within the container
    const svgElement = containerRef.current.querySelector('svg');
    downloadSVG(svgElement as SVGElement);
    toast.success('SVG file downloaded');
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex justify-between mb-3">
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <Plus className="h-4 w-4 mr-1" /> Zoom In
            </Button>
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <Minus className="h-4 w-4 mr-1" /> Zoom Out
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleDownloadBPMN}>
              <Download className="h-4 w-4 mr-1" /> Download BPMN
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadSVG}>
              <Download className="h-4 w-4 mr-1" /> Download SVG
            </Button>
          </div>
        </div>
        
        <div 
          ref={containerRef} 
          className="bpmn-viewer border border-border rounded-md overflow-hidden"
          style={{ height: '500px', width: '100%' }}
        />
      </CardContent>
    </Card>
  );
};

export default BpmnViewer;
