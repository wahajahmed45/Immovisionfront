import { useState, useEffect } from 'react';
import { getUserEmail } from '@/stores/auth/auth';
import { getClientAppointments, updateAppointmentStatus } from '@/services/appointment/AppointmentServices';
import { AppointmentDTO } from '@/types/AppointmentDTO';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Section affichant les rendez-vous en attente de validation.
 * Permet à l'agent de gérer les demandes de rendez-vous (approuver/rejeter).
 */
export default function PendingAppointmentSection() {
    // États pour la gestion des rendez-vous en attente
    const [appointments, setAppointments] = useState<AppointmentDTO[]>([]); // Liste des RDV en attente
    const [loading, setLoading] = useState(true);                          // État de chargement
    const [rejectModalOpen, setRejectModalOpen] = useState(false);         // Modal de rejet
    const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null); // RDV sélectionné pour rejet
    const [rejectComment, setRejectComment] = useState('');                // Commentaire de rejet
    const userEmail = getUserEmail();                                      // Email de l'utilisateur connecté

    /**
     * Charge les rendez-vous en attente au montage du composant.
     * Filtre les rendez-vous pour ne garder que ceux avec le statut PENDING.
     */
    useEffect(() => {
        const fetchPendingAppointments = async () => {
            setLoading(true);
            try {
                const allAppointments = await getClientAppointments(userEmail ?? '');
                setAppointments(allAppointments.filter((apt: AppointmentDTO) => apt.status === 'PENDING'));
            } catch (error) {
                console.error('Error fetching pending appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingAppointments();
    }, [userEmail]);

    /**
     * Gère l'acceptation d'un rendez-vous.
     * Met à jour le statut en APPROVED et rafraîchit la liste.
     * @param appointmentId ID du rendez-vous à approuver
     */
    const handleAccept = async (appointmentId: string) => {
        try {
            await updateAppointmentStatus(appointmentId, 'APPROVED');
            const allAppointments = await getClientAppointments(userEmail ?? '');
            setAppointments(allAppointments.filter((apt: AppointmentDTO) => apt.status === 'PENDING'));
        } catch (error) {
            console.error('Error accepting appointment:', error);
        }
    };

    /**
     * Gère le rejet d'un rendez-vous.
     * Vérifie qu'un commentaire est fourni avant de rejeter.
     * @param appointmentId ID du rendez-vous à rejeter
     */
    const handleReject = async (appointmentId: string) => {
        if (!rejectComment.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            await updateAppointmentStatus(appointmentId, 'REJECTED', rejectComment);
            setRejectModalOpen(false);
            setSelectedAppointment(null);
            setRejectComment('');
            const allAppointments = await getClientAppointments(userEmail ?? '');
            setAppointments(allAppointments.filter((apt: AppointmentDTO) => apt.status === 'PENDING'));
        } catch (error) {
            console.error('Error rejecting appointment:', error);
        }
    };

    /**
     * Ouvre le modal de rejet pour un rendez-vous spécifique.
     * @param appointmentId ID du rendez-vous à rejeter
     */
    const handleRejectClick = (appointmentId: string) => {
        setSelectedAppointment(appointmentId);
        setRejectModalOpen(true);
    };

    /**
     * Convertit un tableau de nombres en objet Date.
     * @param dateArray Tableau représentant une date [année, mois, jour, heure, minute]
     * @returns Objet Date ou null si invalide
     */
    const convertArrayToDate = (dateArray: number[]) => {
        if (!Array.isArray(dateArray) || dateArray.length < 5) return null;
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    };

    // Affichage du loader pendant le chargement
    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    // Rendu de la section avec la liste des rendez-vous en attente
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pending Appointments</h2>

            <div className="grid gap-4">
                {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No pending appointments.
                    </div>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-yellow-200">
                            <div className="flex items-center p-4">
                                <div className="w-32 h-24 relative flex-shrink-0">
                                    <Image
                                        src={appointment.property.image || '/placeholder-property.jpg'}
                                        alt={appointment.property.title}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>

                                <div className="ml-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {appointment.property.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                Client: {appointment.clientName + ' (' + appointment.clientEmail + ')'}
                                            </p>
                                            <p className="text-gray-600">
                                                Agent: {appointment.agent.name + ' (' + appointment.agent.email + ')'}
                                            </p>
                                            <p className="text-gray-600">
                                                Date: {convertArrayToDate(appointment.dateTime)?.toLocaleString()}
                                            </p>
                                            <p className="text-gray-600">
                                                Comment: {appointment.comment}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => handleAccept(appointment.id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectClick(appointment.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <Link
                                            href={`/properties/details/${appointment.property.id}`}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        >
                                            View Property
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de rejet */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Reject Appointment</h3>
                        <textarea
                            value={rejectComment}
                            onChange={(e) => setRejectComment(e.target.value)}
                            placeholder="Please provide a reason for rejection"
                            className="w-full p-2 border rounded-md mb-4"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setSelectedAppointment(null);
                                    setRejectComment('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedAppointment!)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
