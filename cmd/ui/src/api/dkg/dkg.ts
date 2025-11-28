export interface Server {
  hostname: string;
  id: string;
  pods: string[];
  confidence: number;
  internalIP: string;
  allocatable_cpu: string;
  allocatable_memory: string;
  usage_cpu: number;
  usage_memory: number;
}
