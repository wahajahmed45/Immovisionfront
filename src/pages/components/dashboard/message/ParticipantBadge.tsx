import { ConversationDTO } from '@/types/Message/ConversationDTO';

/**
 * ParticipantBadge - Composant d'affichage du rôle d'un participant dans une conversation
 * 
 * Affiche un badge coloré selon le rôle :
 * - Vert pour les propriétaires (Owner)
 * - Bleu pour les agents (Agent)
 * - Gris pour les visiteurs (Visitor)
 */

interface ParticipantBadgeProps {
    participant: ConversationDTO['participant'];  // Infos du participant avec son rôle
    property: ConversationDTO['property'];        // Infos de la propriété
    userEmail: string;                           // Email de l'utilisateur connecté
}

export const ParticipantBadge: React.FC<ParticipantBadgeProps> = ({ participant, property, userEmail }) => {
    if (!participant?.role) return null;

    // Détermine le style et le texte du badge selon le rôle
    const getBadgeContent = () => {
        switch (participant.role) {
            case 'OWNER':
                return {
                    text: 'Owner',
                    className: 'bg-green-100 text-green-800'
                };
            case 'AGENT':
                return {
                    text: 'Agent',
                    className: 'bg-blue-100 text-blue-800'
                };
            case 'VISITOR':
                return {
                    text: 'Visitor',
                    className: 'bg-gray-100 text-gray-600'
                };
            default:
                return null;
        }
    };

    const badge = getBadgeContent();
    if (!badge) return null;

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badge.className}`}>
            {badge.text}
        </span>
    );
}; 
export default ParticipantBadge;