import { useState, useEffect } from 'react';
import { getUserEmail } from '@/stores/auth/auth';
import { getPropertyAppointments } from '@/services/appointment/AppointmentServices';
import { getUserProperties } from '@/services/property/PropertyServices';
import { AppointmentDTO } from '@/types/AppointmentDTO';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Section affichant les rendez-vous liés aux propriétés d'un agent.
 * Permet de visualiser tous les rendez-vous pour les propriétés gérées.
 */
export default function PropertyAppointmentSection() {
    // États pour la gestion des rendez-vous
    const [appointments, setAppointments] = useState<AppointmentDTO[]>([]); // Liste des RDV
    const [loading, setLoading] = useState(true);                          // État de chargement
    const userEmail = getUserEmail();                                      // Email de l'agent connecté

    /**
     * Charge les rendez-vous des propriétés au montage du composant.
     * Récupère d'abord les propriétés de l'agent puis leurs rendez-vous.
     */
    useEffect(() => {
        const fetchPropertyAppointments = async () => {
            setLoading(true);
            try {
                const properties = await getUserProperties(userEmail ?? '');
                const propertyAppointments = await Promise.all(
                    properties.map(property => getPropertyAppointments(property.id))
                );
                setAppointments(propertyAppointments.flat());
            } catch (error) {
                console.error('Error fetching property appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyAppointments();
    }, [userEmail]);

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

    // Affichage du loader pendant le chargement
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Rendu de la section avec la liste des rendez-vous par propriété
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Property Appointments</h2>

            <div className="grid gap-4">
                {/* Affichage des rendez-vous ou message si aucun */}
                {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No property appointments found.
                    </div>
                ) : (
                    // Liste des rendez-vous avec détails
                    // Chaque rendez-vous affiche :
                    // - Image de la propriété
                    // - Titre et lien vers la propriété
                    // - Date et heure
                    // - Localisation
                    // - Informations client et agent
                    // - Commentaires et statut
                    appointments.map((appointment) => (
                        <div key={appointment.id} 
                            className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
                                appointment.status === 'CANCELLED' ? 'border-red-200' : 'border-gray-100'
                            }`}>
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
                                            <Link href={`/properties/${appointment.property.id}`}
                                                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                {appointment.property.title}
                                            </Link>
                                            
                                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {convertArrayToDate(appointment.dateTime)}
                                            </div>

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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="font-medium">Agent:</span> {appointment.agent.name + ' (' + appointment.agent.email + ')'}
                                                </div>
                                            </div>

                                            {appointment.comment && (
                                                <div className={`mt-2 p-3 rounded-md ${
                                                    appointment.status === 'CANCELLED' ? 'bg-red-50 border border-red-100' : ''
                                                }`}>
                                                    <div className="text-sm">
                                                        <span className="font-medium">
                                                            {appointment.status === 'CANCELLED' ? 'Cancellation Reason:' : 'Comment:'}
                                                        </span>
                                                        <p className={`mt-1 ${
                                                            appointment.status === 'CANCELLED' ? 'text-red-700' : 'text-gray-600'
                                                        }`}>
                                                            {appointment.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                appointment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                appointment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {appointment.status}
                                            </span>

                                            <Link
                                                href={`/properties/details/${appointment.property.id}`}
                                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors text-center"
                                            >
                                                View Property
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
