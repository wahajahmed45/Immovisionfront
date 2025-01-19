import { useState } from 'react';
import { PropertyDashboardDTO } from '@/types/Property/PropertyDashboardDTO';

/**
 * Modal pour la création d'un nouveau rendez-vous.
 * Permet de sélectionner une propriété, spécifier un client et une date/heure.
 */
interface CreateAppointmentModalProps {
    isOpen: boolean;                                    // État d'ouverture du modal
    onClose: () => void;                               // Fonction de fermeture
    onSubmit: (appointmentData: any) => void;          // Fonction de soumission
    properties: PropertyDashboardDTO[];                // Liste des propriétés disponibles
}

/**
 * Composant de modal pour créer un nouveau rendez-vous.
 * Gère le formulaire de création avec validation des champs requis.
 */
export default function CreateAppointmentModal({ isOpen, onClose, onSubmit, properties }: CreateAppointmentModalProps) {
    // États pour les champs du formulaire
    const [selectedProperty, setSelectedProperty] = useState('');  // Propriété sélectionnée
    const [clientEmail, setClientEmail] = useState('');           // Email du client
    const [dateTime, setDateTime] = useState('');                 // Date et heure du RDV
    const [comment, setComment] = useState('');                   // Commentaire optionnel

    /**
     * Gère la soumission du formulaire.
     * Formate les données et les envoie au composant parent.
     * @param e Événement de soumission du formulaire
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            propertyId: selectedProperty,
            clientEmail,
            dateTime: new Date(dateTime).toISOString(),
            comment
        });
        onClose();
    };

    // Ne rend rien si le modal n'est pas ouvert
    if (!isOpen) return null;

    // Rendu du modal avec le formulaire
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create New Appointment</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property
                            </label>
                            <select
                                value={selectedProperty}
                                onChange={(e) => setSelectedProperty(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            >
                                <option value="">Select a property</option>
                                {properties.map((property) => (
                                    <option key={property.id} value={property.id}>
                                        {property.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Email
                            </label>
                            <input
                                type="email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date and Time
                            </label>
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Comment (optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Create Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
