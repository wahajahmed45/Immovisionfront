export interface DashboardMessageDTO {
  id: string;
  content: string;
  senderEmail: string;
  receiverEmail: string;
  sentAt: string;
  property?: {
    id: string;
    title: string;
  };
} 