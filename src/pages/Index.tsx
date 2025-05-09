
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import TextInput from '@/components/TextInput';
import BpmnViewer from '@/components/BpmnViewer';
import XmlViewer from '@/components/XmlViewer';
import EnhancedResult from '@/components/EnhancedResult';
import { enhanceText, generateBPMN, hasApiKey } from '@/services/openai';
import { validateBPMNXml } from '@/services/bpmnUtils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [bpmnXml, setBpmnXml] = useState('');
  const [showEnhanced, setShowEnhanced] = useState(false);

  useEffect(() => {
    // Check if API key exists
    if (!hasApiKey()) {
      toast.info('Please set your OpenAI API key in the settings to use this application');
    }
  }, []);

  const handleGenerateBPMN = async (text: string, enhance: boolean) => {
    if (!hasApiKey()) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    setLoading(true);
    setOriginalText(text);
    let processedText = text;

    try {
      // Step 1: Enhance text if requested
      if (enhance) {
        toast.info('Enhancing text description...');
        const enhanced = await enhanceText(text);
        setEnhancedText(enhanced);
        processedText = enhanced;
        setShowEnhanced(true);
      } else {
        setShowEnhanced(false);
      }

      // Step 2: Generate BPMN XML
      toast.info('Generating BPMN diagram...');
      const bpmn = await generateBPMN(processedText);
      
      // Step 3: Validate the generated XML
      if (validateBPMNXml(bpmn)) {
        setBpmnXml(bpmn);
        toast.success('BPMN diagram generated successfully!');
      } else {
        toast.error('Invalid BPMN XML generated. Please try again or modify your description.');
      }
    } catch (error: any) {
      console.error('Error in generation process:', error);
      toast.error(`Error: ${error.message || 'Failed to generate BPMN'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleXmlUpdate = (updatedXml: string) => {
    if (validateBPMNXml(updatedXml)) {
      setBpmnXml(updatedXml);
      toast.success('BPMN diagram updated successfully!');
    } else {
      toast.error('Invalid BPMN XML. Please check your changes.');
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <Header />
          <Link to="/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" /> API Key Settings
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <TextInput 
            onSubmit={handleGenerateBPMN}
            disabled={!hasApiKey()}
            loading={loading}
          />
          
          {showEnhanced && enhancedText && (
            <EnhancedResult 
              originalText={originalText}
              enhancedText={enhancedText}
            />
          )}
          
          {bpmnXml && (
            <>
              <BpmnViewer bpmnXml={bpmnXml} />
              <XmlViewer xml={bpmnXml} onUpdate={handleXmlUpdate} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
