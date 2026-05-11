export interface ActionItem {
  id: number;
  description: string;
  assignee: string;
  deadline: string;
  status: string;
  hasPersonAssigned: boolean;
  hasDeadline: boolean;
  assigneeConfidence: number;
  deadlineConfidence: number;
  statusConfidence: number;
}