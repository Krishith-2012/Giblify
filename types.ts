export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING_IMAGE = 'PROCESSING_IMAGE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GenerationResult {
  originalImage: string; // Base64
  generatedImage: string; // Base64
}

export interface DeploymentGuideProps {
  isOpen: boolean;
  onClose: () => void;
}