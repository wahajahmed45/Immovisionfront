import { MessageDTO } from '@/types/Message/MessageDTO';
import { ConversationDTO } from '@/types/Message/ConversationDTO';
import { SendMessageDTO } from '@/types/Message/SendMessageDTO';
import config from '@/utils/config';

// Récupérer toutes les conversations d'un utilisateur
export const getUserConversations = async (userEmail: string): Promise<ConversationDTO[]> => {
  const response = await fetch(`${config.apiBaseUrl}/messages/conversations/${userEmail}`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
};

// Récupérer tous les messages d'une conversation spécifique
export const getConversationMessages = async (
  user1Email: string,
  user2Email: string,
  propertyId: string
): Promise<MessageDTO[]> => {
  const response = await fetch(
    `${config.apiBaseUrl}/messages/conversation?user1Email=${user1Email}&user2Email=${user2Email}&propertyId=${propertyId}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversation messages');
  }

  return await response.json();
};

// Envoyer un nouveau message
export const sendMessage = async (messageData: SendMessageDTO): Promise<void> => {
  const response = await fetch(`${config.apiBaseUrl}/messages/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return;
};

export const markMessagesAsRead = async (
  receiverEmail: string,
  senderEmail: string,
  propertyId: string
): Promise<void> => {
  const response = await fetch(
    `${config.apiBaseUrl}/messages/read?receiverEmail=${receiverEmail}&senderEmail=${senderEmail}&propertyId=${propertyId}`,
    { method: 'PUT' }
  );
  if (!response.ok) {
    throw new Error('Failed to mark messages as read');
  }
};
