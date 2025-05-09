
import OpenAI from 'openai';

// In a real application, this would be securely stored and not hardcoded
const DEFAULT_API_KEY = ''; // Empty string as placeholder

// Initialize apiKey from localStorage if available
let apiKey = localStorage.getItem('openai_api_key') || DEFAULT_API_KEY;

export const setApiKey = (key: string) => {
  apiKey = key;
};

export const getApiKey = () => apiKey;

export const hasApiKey = () => !!apiKey && apiKey.trim() !== '';

const createOpenAIClient = () => {
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the backend
  });
};

export const enhanceText = async (text: string): Promise<string> => {
  if (!text.trim()) return '';
  
  const openai = createOpenAIClient();
  // Can use gpt-4o-mini for this task
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a business analyst. Improve and clarify the user\'s description of a business process to ensure it\'s precise and complete for a machine to model as a BPMN diagram. Consider naming standards to ensure the BPMN diagram can be made from this description alone.'
        },
        { role: 'user', content: text }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error enhancing text:', error);
    throw error;
  }
};

export const generateBPMN = async (text: string): Promise<string> => {
  if (!text.trim()) return '';

  const openai = createOpenAIClient();
  // Must use gpt-4o for this task mini will not work
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in business process modeling. Convert the following business process into BPMN 2.0 XML format. Include only the raw XML. Please include in your response complete process definition with all elements and sequence flows. Complete BPMNDiagram section with, BPMNShape elements for all process nodes with clear coordinates, BPMNEdge elements for all connections with precise waypoints matching the flow described above. Ensure all edges have proper waypoints that create a clean, logical flow. Do not include explanations or code fences.'
        },
        { role: 'user', content: text }
      ],
      temperature: 0.2,
      max_tokens: 3000
    });

    const bpmnXML = response.choices[0]?.message?.content || '';
    return bpmnXML;
  } catch (error) {
    console.error('Error generating BPMN:', error);
    throw error;
  }
};
