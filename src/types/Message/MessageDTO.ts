// Pour représenter un message dans la conversation
export interface MessageDTO {
    id: string;
    content: string;
    senderEmail: string;
    receiverEmail: string;
    sentAt: string;
    isRead: boolean;
    property: {
      id: string;
      title: string;
    };
  }