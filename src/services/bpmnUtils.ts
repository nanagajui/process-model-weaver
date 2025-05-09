
// File download functions temporarily disabled
// import { saveAs } from 'file-saver';

export const downloadBPMN = (bpmnXml: string, filename: string = 'process') => {
  console.log('BPMN download requested - functionality temporarily disabled');
  console.log('Content would have been saved as:', filename + '.bpmn');
  // Temporary solution: create a data URL that can be opened in a new tab
  const blob = new Blob([bpmnXml], { type: 'application/xml' });
  const dataUrl = URL.createObjectURL(blob);
  window.open(dataUrl, '_blank');
  // Previous implementation using file-saver:
  // const blob = new Blob([bpmnXml], { type: 'application/xml' });
  // saveAs(blob, `${filename}.bpmn`);
};

export const downloadSVG = (svgElement: SVGElement | null, filename: string = 'process') => {
  if (!svgElement) return;
  console.log('SVG download requested - functionality temporarily disabled');
  console.log('Content would have been saved as:', filename + '.svg');

  // Clone the SVG to avoid modifying the displayed one
  const svgClone = svgElement.cloneNode(true) as SVGElement;
  
  // Ensure SVG has proper XML namespaces
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  
  // Set proper dimensions if not already set
  if (!svgClone.hasAttribute('width') || !svgClone.hasAttribute('height')) {
    // TypeScript doesn't recognize getBBox on SVGElement directly, so we need to cast it
    // to SVGGraphicsElement which does have this method
    const svgGraphicsElement = svgElement as unknown as SVGGraphicsElement;
    const bbox = svgGraphicsElement.getBBox();
    svgClone.setAttribute('width', bbox.width.toString());
    svgClone.setAttribute('height', bbox.height.toString());
    svgClone.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
  }
  
  // Create a serialized SVG string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  
  // Temporary solution: create a data URL that can be opened in a new tab
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const dataUrl = URL.createObjectURL(blob);
  window.open(dataUrl, '_blank');
  
  // Previous implementation using file-saver:
  // const blob = new Blob([svgString], { type: 'image/svg+xml' });
  // saveAs(blob, `${filename}.svg`);
};

export const validateBPMNXml = (xml: string): boolean => {
  try {
    // Basic validation check - just see if it parses as XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      return false;
    }
    
    // Simple check for BPMN elements
    const hasDefinitions = xmlDoc.getElementsByTagNameNS('http://www.omg.org/spec/BPMN/20100524/MODEL', 'definitions').length > 0;
    if (!hasDefinitions) {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
};
