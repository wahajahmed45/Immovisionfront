import { useEffect, useState } from "react";
import { getUserEmail, getUserRole } from "@/stores/auth/auth";
import { getUserProperties, getAgentProperties, deleteUserProperty, deleteProperty } from "@/services/property/PropertyServices";
import { PropertyDashboardDTO } from "@/types/Property/PropertyDashboardDTO";
import Image from "next/image";
import { useRouter } from "next/router";

/**
 * Composant de gestion des propriétés dans le dashboard.
 * Affiche la liste des propriétés de l'utilisateur ou de l'agent avec leurs statuts et actions possibles.
 */
export default function PropertySection() {
    // États et hooks
    const [userProperties, setUserProperties] = useState<PropertyDashboardDTO[]>([]); // Liste des propriétés
    const userEmail = getUserEmail();    // Email de l'utilisateur connecté
    const userRole = getUserRole();      // Rôle de l'utilisateur (user/agent)
    const router = useRouter();          // Hook de routage Next.js

    /**
     * Effet pour charger les propriétés au montage du composant
     * et lorsque l'email ou le rôle change.
     * Charge des propriétés différentes selon le rôle (agent ou utilisateur).
     */
    useEffect(() => {
        const fetchUserProperties = async () => {
            if (userEmail) {
                try {
                    if(userRole?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'role_agent'){
                        const properties = await getAgentProperties(userEmail);
                        setUserProperties(properties);
                    } else {
                        const properties = await getUserProperties(userEmail);
                        setUserProperties(properties);
                    }
                } catch (error) {
                    console.error('Error fetching user properties:', error);
                }
            }
        };

        fetchUserProperties();
    }, [userEmail, userRole]);

    /**
     * Gère la suppression d'une propriété.
     * Demande confirmation avant suppression et met à jour la liste après.
     * @param propertyId - ID de la propriété à supprimer
     */
    const handleDeleteProperty = async (propertyId: string) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteProperty(propertyId);
                if(userRole?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'role_agent'){
                    const properties = await getAgentProperties(userEmail ?? "");
                    setUserProperties(properties);
                } else {
                    const properties = await getUserProperties(userEmail ?? "");
                    setUserProperties(properties);
                }
            } catch (error) {
                console.error('Error deleting property:', error);
            }
        }
    };

    /**
     * Rendu du composant avec :
     * - Tableau des propriétés
     * - Statut d'approbation avec styles conditionnels
     * - Actions (voir, éditer, supprimer)
     * - Images et informations de base
     * - Commentaires de rejet si applicable
     */
    return (
        <div className="transition-all duration-300">
            <div className="overflow-x-auto mb-8">
                <h2 className="text-xl font-bold mb-4">My Properties</h2>
                <table className="w-full text-sm lg:text-base">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 text-left">Property</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userProperties.map((property) => (
                            <tr key={property.id} className="border-b">
                                <td className="p-4">
                                    <div className="flex items-center">
                                        {property.imageUrl && (
                                            <img
                                                src={property.imageUrl}
                                                alt={property.title}
                                                className="w-16 h-16 object-cover rounded mr-4"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-medium">{property.title}</h3>
                                            <p className="text-gray-600">{property.location}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded ${
                                        property.approvalStatus === 'APPROVED' 
                                            ? 'bg-green-100 text-green-800'
                                            : property.approvalStatus === 'REJECTED'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {property.approvalStatus}
                                    </span>
                                    {property.approvalStatus === 'REJECTED' && property.approvalComment && (
                                        <p className="text-sm text-red-600 mt-1 italic">
                                            Reason: {property.approvalComment}
                                        </p>
                                    )}
                                </td>
                                <td className="p-4">${property.price}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/properties/details/${property.id}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            View
                                        </button>
                                        {((userRole?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'role_agent') || property.approvalStatus === 'PENDING' || property.approvalStatus === 'REJECTED') && (
                                            <>
                                                <button
                                                    onClick={() => router.push(`/properties/edit/${property.id}`)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProperty(property.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
