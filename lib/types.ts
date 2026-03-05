export interface WorkflowStep {
  title: string;
  description: string;
  deliverable: string;
  estimatedTime: string;
  dependencies: string[];
  tips: string;
}

export interface WorkflowPhase {
  name: string;
  duration: string;
  steps: WorkflowStep[];
}

export interface WorkflowResult {
  goal: string;
  method?: string;
  phases: WorkflowPhase[];
  totalEstimatedTime: string;
  criticalPath: string[];
  risks: string[];
}
