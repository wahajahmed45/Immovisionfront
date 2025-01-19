// Pour représenter une conversation dans la liste
export interface ConversationDTO {
    id: string;
    lastMessage: {
      senderEmail: string;
      content: string;
      sentAt: string;
      read: boolean;
    };
    property: {
      id: string;
      title: string;
      imageUrl?: string;
      ownerEmail?: string;
      agentEmail?: string;
    };
    participant: {
      email: string;
      name?: string;
      role?: 'OWNER' | 'AGENT' | 'VISITOR';
    };
  }