import { useState, useEffect } from 'react';
import { getUserEmail, getUserRole } from '@/stores/auth/auth';
import CreateAppointmentModal from './createAppointmentModal';
import { getAgentProperties } from "@/services/property/PropertyServices";
import { PropertyDashboardDTO } from '@/types/Property/PropertyDashboardDTO';
import { getClientAppointments, getAgentAppointments, createAppointment, updateAppointmentStatus } from '@/services/appointment/AppointmentServices';
import { AppointmentDTO } from '@/types/AppointmentDTO';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Composant de gestion des rendez-vous dans le dashboard.
 * Permet de visualiser, créer et gérer les rendez-vous selon le rôle de l'utilisateur.
 */
export default function AppointmentSection() {
    // États pour gérer les rendez-vous et l'interface utilisateur
    const [appointments, setAppointments] = useState<AppointmentDTO[]>([]); // Liste des rendez-vous
    const [loading, setLoading] = useState(true);                          // État de chargement
    const [isModalOpen, setIsModalOpen] = useState(false);                // Modal de création
    const [cancelModalOpen, setCancelModalOpen] = useState(false);        // Modal d'annulation
    const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null); // RDV sélectionné pour annulation
    const [cancelComment, setCancelComment] = useState('');               // Commentaire d'annulation
    const userEmail = getUserEmail();                                     // Email de l'utilisateur connecté
    const userRole = getUserRole();                                       // Rôle de l'utilisateur
    const [properties, setProperties] = useState<PropertyDashboardDTO[]>([]); // Liste des propriétés (pour agents)

    /**
     * Charge les rendez-vous au montage du composant.
     * Récupère les RDV selon le rôle de l'utilisateur (agent ou client).
     */
    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const data = userRole?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'role_agent'
                    ? await getAgentAppointments(userEmail ?? '')
                    : await getClientAppointments(userEmail ?? '');
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [userEmail, userRole]);

    /**
     * Charge les propriétés si l'utilisateur est un agent.
     */
    useEffect(() => {
        const fetchProperties = async () => {
            if (userRole?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'role_agent') {
                const data = await getAgentProperties(userEmail ?? '');
                setProperties(data);
            }
        };
        fetchProperties();
    }, [userRole, userEmail]);

    /**
     * Convertit un tableau de nombres en date formatée.
     * @param dateArray Tableau représentant une date [année, mois, jour, heure, minute]
     * @returns Date formatée en string ou null si invalide
     */
    const convertArrayToDate = (dateArray: number[]) => {
        if (!Array.isArray(dateArray) || dateArray.length < 5) return null;
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
        
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');
    };

    /**
     * Gère la création d'un nouveau rendez-vous.
     * @param appointmentData Données du nouveau rendez-vous
     */
    const handleCreateAppointment = async (appointmentData: any) => {
        try {
            await createAppointment({
                ...appointmentData,
                agentEmail: userEmail
            });
            
            // Rafraîchir immédiatement la liste
            const newData = await getAgentAppointments(userEmail ?? '');
            setAppointments(newData);
            
            // Fermer le modal
            setIsModalOpen(false);
        } catch (error) {
            // Afficher le message d'erreur dans une alerte plus conviviale
            alert(error instanceof Error ? error.message : 'Une erreur est survenue');
        }
    };

    /**
     * Met à jour le statut d'un rendez-vous.
     * @param id ID du rendez-vous
     * @param status Nouveau statut
     * @param comment Commentaire optionnel
     */
    const handleStatusChange = async (id: string, status: string, comment?: string) => {
        try {
            await updateAppointmentStatus(id, status, comment);
            // Rafraîchir la liste
            const data = userRole?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'role_agent'
                ? await getAgentAppointments(userEmail ?? '')
                : await getClientAppointments(userEmail ?? '');
            setAppointments(data);
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };

    /**
     * Ouvre le modal d'annulation pour un rendez-vous.
     * @param appointmentId ID du rendez-vous à annuler
     */
    const handleCancelClick = (appointmentId: string) => {
        setSelectedAppointment(appointmentId);
        setCancelModalOpen(true);
    };

    /**
     * Confirme l'annulation d'un rendez-vous.
     * Vérifie que le commentaire est renseigné avant de procéder.
     */
    const handleCancelConfirm = async () => {
        if (!cancelComment.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }

        if (selectedAppointment) {
            await handleStatusChange(selectedAppointment, 'CANCELLED', cancelComment);
            setCancelModalOpen(false);
            setSelectedAppointment(null);
            setCancelComment('');
        }
    };

    // Affichage du loader pendant le chargement
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Rendu du composant
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>
                {(userRole?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'role_agent') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Appointment
                    </button>
                )}
            </div>

            <div className="grid gap-4">
                {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No appointments found for this view.
                    </div>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment.id} 
                            className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
                                appointment.status === 'CANCELLED' ? 'border-red-200' : 'border-gray-100'
                            }`}>
                            <div className="flex items-center p-4">
                                {/* Image de la propriété */}
                                <div className="w-32 h-24 relative flex-shrink-0">
                                    <Image
                                        src={appointment.property.image || '/placeholder-property.jpg'}
                                        alt={appointment.property.title}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>

                                {/* Informations principales */}
                                <div className="ml-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link href={`/properties/${appointment.property.id}`}
                                                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                {appointment.property.title}
                                            </Link>
                                            
                                            {/* Date */}
                                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {(() => {
                                                    const date = convertArrayToDate(appointment.dateTime);
                                                    return date || 'Invalid Date';
                                                })()}
                                            </div>

                                            {/* Participants */}
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="font-medium">Location:</span> {appointment.property.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="font-medium">Client:</span> {appointment.clientName + ' (' + appointment.clientEmail + ')'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="font-medium">Agent:</span> {appointment.agent.name + ' (' + appointment.agent.email + ')'}
                                                </div>
                                            </div>

                                            {/* Commentaire conditionnel */}
                                            {appointment.comment && (
                                                <div className={`mt-2 p-3 rounded-md ${
                                                    appointment.status === 'CANCELLED' 
                                                        ? 'bg-red-50 border border-red-100' 
                                                        : ''
                                                }`}>
                                                    <div className="text-sm">
                                                        <span className="font-medium">
                                                            {appointment.status === 'CANCELLED' 
                                                                ? 'Cancellation Reason:' 
                                                                : 'Comment:'
                                                            }
                                                        </span>
                                                        <p className={`mt-1 ${
                                                            appointment.status === 'CANCELLED'
                                                                ? 'text-red-700'
                                                                : 'text-gray-600'
                                                        }`}>
                                                            {appointment.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Statut et Actions */}
                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                appointment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                appointment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {appointment.status}
                                            </span>

                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    href={`/properties/details/${appointment.property.id}`}
                                                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors text-center"
                                                >
                                                    View Property
                                                </Link>

                                                {appointment.status !== 'CANCELLED' && appointment.status !== 'REJECTED' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleCancelClick(appointment.id);
                                                        }}
                                                        className="px-4 py-2 border border-red-500 text-red-500 text-sm rounded-md hover:bg-red-50 transition-colors"
                                                    >
                                                        Cancel Appointment
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <CreateAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateAppointment}
                properties={properties}
            />

            {/* Modal de confirmation d'annulation */}
            {cancelModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Cancel Appointment</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Please provide a reason for cancellation *
                            </label>
                            <textarea
                                value={cancelComment}
                                onChange={(e) => setCancelComment(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                rows={3}
                                required
                                placeholder="Enter your reason here..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setCancelModalOpen(false);
                                    setSelectedAppointment(null);
                                    setCancelComment('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                disabled={!cancelComment.trim()}
                            >
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
