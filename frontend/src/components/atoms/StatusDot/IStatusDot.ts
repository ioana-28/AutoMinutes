export type StatusDotStatus = 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'UNKNOWN';

export interface StatusDotProps {
  status: StatusDotStatus;
  className?: string;
  title?: string;
}
