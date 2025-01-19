import { useEffect, useState } from "react";
import { getUserEmail } from "@/stores/auth/auth";
import { getFavoriteProperties } from "@/services/property/PropertyServices";
import { PropertyDashboardDTO } from "@/types/Property/PropertyDashboardDTO";
import { useRouter } from "next/router";
import Image from "next/image";

/**
 * Composant affichant les propriétés favorites de l'utilisateur.
 * Permet de visualiser et d'accéder rapidement aux propriétés mises en favoris.
 */
export default function FavoriteSection() {
    // État pour stocker la liste des propriétés favorites
    const [favoriteProperties, setFavoriteProperties] = useState<PropertyDashboardDTO[]>([]);
    // Récupération de l'email de l'utilisateur connecté
    const userEmail = getUserEmail();
    // Hook de routage pour la navigation
    const router = useRouter();

    /**
     * Effet pour charger les propriétés favorites au montage du composant
     * et lorsque l'email de l'utilisateur change.
     */
    useEffect(() => {
        const fetchFavorites = async () => {
            if (userEmail) {
                try {
                    const favorites = await getFavoriteProperties(userEmail);
                    setFavoriteProperties(favorites);
                } catch (error) {
                    console.error("Error fetching favorites:", error);
                }
            }
        };

        fetchFavorites();
    }, [userEmail]);

    /**
     * Rendu du composant :
     * - Message si aucun favori
     * - Grille de cartes pour chaque propriété favorite
     * - Chaque carte affiche :
     *   - Image de la propriété
     *   - Titre
     *   - Localisation
     *   - Bouton de détails
     *   - Icône favori
     */
    return (
        <div className="transition-all duration-300">
            {favoriteProperties.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <i className="fas fa-heart text-gray-400 text-4xl mb-3"></i>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorite Properties</h3>
                    <p className="text-gray-500">
                        You haven't added any properties to your favorites yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProperties.map((property) => (
                        <div 
                            key={property.id} 
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                            onClick={() => router.push(`/properties/details/${property.id}`)}
                        >
                            <Image 
                                src={property.imageUrl || '/placeholder-property.jpg'} 
                                alt={property.title}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    {property.location}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-blue-600">
                                        View Details
                                    </span>
                                    <i className="fas fa-heart text-red-600"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
