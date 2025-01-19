import React, { useState, useEffect } from 'react';
import { ConversationDTO } from '@/types/Message/ConversationDTO';
import { MessageDTO } from '@/types/Message/MessageDTO';
import { getUserConversations, getConversationMessages, sendMessage, markMessagesAsRead } from '@/services/Message/MessageServices';
import { useRouter } from 'next/router';
import CreateAppointmentModal from '../appointment/createAppointmentModal';
import { PropertyDashboardDTO } from '@/types/Property/PropertyDashboardDTO';
import { ParticipantBadge } from './ParticipantBadge';

/**
 * Composant MessageSection - Gère l'interface de messagerie entre utilisateurs
 * Similaire à une interface type WhatsApp/Messenger
 */

interface MessageSectionProps {
  userEmail: string;
}

/**
 * Fonction utilitaire pour formater la date des messages
 * Affiche différents formats selon l'ancienneté du message :
 * - Aujourd'hui : uniquement l'heure
 * - Cette année : date sans année
 * - Plus ancien : date complète
 */
const formatDate = (dateArray: any) => {
  try {
    if (!Array.isArray(dateArray)) return '';
    
    // Conversion du tableau en date
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Si c'est aujourd'hui, afficher seulement l'heure
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `${date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    
    // Si c'est cette année, afficher jour/mois et heure
    if (date.getFullYear() === today.getFullYear()) {
      return `${date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      })} ${date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }
    
    // Sinon afficher la date complète avec l'année et l'heure
    return `${date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })} ${date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return '';
  }
};

/**
 * Type pour stocker les informations de la conversation active
 * Utilisé pour maintenir la cohérence des données même pendant les rechargements
 */
type ActiveConversationInfo = {
    participantEmail: string;
    propertyId: string;
    participantName?: string;
    propertyTitle?: string;
    propertyImage?: string;
};

export const MessageSection: React.FC<MessageSectionProps> = ({ userEmail }) => {
    // États pour gérer les données
    const [conversations, setConversations] = useState<ConversationDTO[]>([]); // Liste des conversations
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null); // ID de la conversation sélectionnée
    const [messages, setMessages] = useState<MessageDTO[]>([]); // Messages de la conversation active
    const [newMessage, setNewMessage] = useState(''); // Contenu du nouveau message
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [properties, setProperties] = useState<PropertyDashboardDTO[]>([]);
    const [activeConversationInfo, setActiveConversationInfo] = useState<ActiveConversationInfo | null>(null);

    // Données de la conversation courante
    const currentConversation = conversations.find(c => c.id === selectedConversation);
    const currentParticipant = currentConversation?.participant || activeConversationInfo ? {
        email: activeConversationInfo?.participantEmail,
        name: currentConversation?.participant?.name || 'Loading...'
    } : null;
    const currentProperty = currentConversation?.property || activeConversationInfo ? {
        id: activeConversationInfo?.propertyId,
        title: currentConversation?.property?.title || 'Loading...',
        imageUrl: currentConversation?.property?.imageUrl
    } : null;

    /**
     * Effect pour charger et mettre à jour la liste des conversations
     * Se rafraîchit toutes les 3 secondes
     */
    useEffect(() => {
        const loadConversations = async () => {
            try {
                const data = await getUserConversations(userEmail);
                setConversations(data);
            } catch (error) {
                console.error('Error loading conversations:', error);
            }
        };

        loadConversations();
        const interval = setInterval(loadConversations, 3000);
        return () => clearInterval(interval);
    }, [userEmail]);

    /**
     * Effect pour charger et mettre à jour les messages de la conversation active
     * Se rafraîchit toutes les 3 secondes
     */
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedConversation || !activeConversationInfo) return;

            try {
                await markMessagesAsRead(
                    userEmail,
                    activeConversationInfo.participantEmail,
                    activeConversationInfo.propertyId
                );

                const messagesData = await getConversationMessages(
                    userEmail,
                    activeConversationInfo.participantEmail,
                    activeConversationInfo.propertyId
                );
                setMessages(messagesData);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        if (selectedConversation && activeConversationInfo) {
            loadMessages();
            const interval = setInterval(loadMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation, userEmail, activeConversationInfo]);

    /**
     * Gère l'envoi d'un nouveau message
     * Met à jour la conversation après l'envoi
     */
    const handleSendMessage = async () => {
        if (!selectedConversation || !newMessage.trim() || !activeConversationInfo) return;

        try {
            await sendMessage({
                content: newMessage,
                senderEmail: userEmail,
                receiverEmail: activeConversationInfo.participantEmail,
                propertyId: activeConversationInfo.propertyId
            });
            setNewMessage('');
            
            const messagesData = await getConversationMessages(
                userEmail,
                activeConversationInfo.participantEmail,
                activeConversationInfo.propertyId
            );
            setMessages(messagesData);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    /**
     * Gère la sélection d'une conversation dans la liste
     * Met à jour les informations de la conversation active
     */
    const handleConversationSelect = (conversationId: string) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setSelectedConversation(conversationId);
            setActiveConversationInfo({
                participantEmail: conversation.participant.email,
                propertyId: conversation.property.id,
                participantName: conversation.participant.name,
                propertyTitle: conversation.property.title,
                propertyImage: conversation.property.imageUrl
            });
        }
    };

    return (
        <div className="flex h-[600px] bg-white rounded-lg shadow-sm">
            {/* Liste des conversations (1/3 de la largeur) */}
            <div className="w-1/3 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Messages</h2>
                </div>
                <div className="overflow-y-auto h-[calc(100%-4rem)]">
                    {conversations?.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => handleConversationSelect(conv.id)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedConversation === conv.id ? 'bg-blue-50' : ''
                            } ${!conv.lastMessage?.read && conv.lastMessage?.senderEmail !== userEmail ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''}`}
                        >
                            <div className="flex items-start space-x-3">
                                {/* Photo de profil */}
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0">
                                    <div className="w-full h-full rounded-full flex items-center justify-center bg-blue-500 text-white text-lg">
                                        {conv.participant?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                </div>

                                {/* Infos conversation */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-medium truncate ${!conv.lastMessage?.read && conv.lastMessage?.senderEmail !== userEmail ? 'font-bold text-blue-900' : 'text-gray-900'}`}>
                                            {conv.participant?.name || 'unknown user'}
                                        </h3>
                                        <span className={`text-xs ${!conv.lastMessage?.read && conv.lastMessage?.senderEmail !== userEmail ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                                            {formatDate(conv.lastMessage?.sentAt || '')}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-1 truncate ${!conv.lastMessage?.read && conv.lastMessage?.senderEmail !== userEmail ? 'font-semibold text-blue-800' : 'text-gray-500'}`}>
                                        {conv.property?.title || 'unknown property'}
                                    </p>
                                    <p className={`text-sm mt-1 truncate ${!conv.lastMessage?.read && conv.lastMessage?.senderEmail !== userEmail ? 'font-semibold text-blue-700' : 'text-gray-600'}`}>
                                        {conv.lastMessage?.content || ''}
                                    </p>
                                    {!conv.lastMessage?.read && conv.lastMessage?.senderEmail !== userEmail && (
                                        <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            Nouveau message
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone de conversation (2/3 de la largeur) */}
            <div className="w-2/3 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* En-tête avec infos du participant et de la propriété */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Photo de profil */}
                                    <div className="w-10 h-10 rounded-full bg-gray-200">
                                        <div className="w-full h-full rounded-full flex items-center justify-center bg-blue-500 text-white">
                                            {currentParticipant?.name?.[0]?.toUpperCase() || '...'}
                                        </div>
                                    </div>

                                    {/* Info participant avec badge */}
                                    <div>
                                        <h3 className="font-medium">
                                            {currentParticipant?.name || 'Loading...'}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {currentParticipant?.email || 'Loading...'}
                                        </p>
                                        {currentConversation && (
                                            <div className="mt-1">
                                                <ParticipantBadge 
                                                    participant={currentConversation.participant}
                                                    property={currentConversation.property}
                                                    userEmail={userEmail}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Miniature et titre du bien */}
                                    <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                            {currentProperty?.imageUrl ? (
                                                <img 
                                                    src={currentProperty.imageUrl} 
                                                    alt="Property" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        if (target.parentElement) {
                                                            target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-gray-500 text-xs">Loading...</span></div>';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">Loading...</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {currentProperty?.title || 'Loading...'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Bouton voir le bien */}
                                <button
                                    onClick={() => router.push(`/properties/details/${currentProperty?.id}`)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    View property
                                </button>
                            </div>
                        </div>

                        {/* Zone des messages avec défilement inversé style WhatsApp */}
                        <div className="flex-1 overflow-y-auto flex flex-col-reverse">
                            <div className="p-4 space-y-4">
                                {messages?.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`max-w-[70%] p-3 rounded-lg ${
                                            message.senderEmail === userEmail
                                                ? 'ml-auto bg-blue-600 text-white !important'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <p className={message.senderEmail === userEmail ? 'text-white' : 'text-gray-800'}>
                                            {message.content}
                                        </p>
                                        <span className={`text-xs ${message.senderEmail === userEmail ? 'text-white opacity-70' : 'text-gray-500'}`}>
                                            {formatDate(message.sentAt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Zone de saisie du message */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Écrivez votre message..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Sélectionnez une conversation pour commencer
                    </div>
                )}
            </div>
        </div>
    );
};
export default MessageSection;