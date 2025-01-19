import { useEffect, useState } from "react";
import { getUserEmail } from "@/stores/auth/auth";
import { getUserInfo } from "@/services/user/UserServices";
import { UserInfoDTO } from "@/types/User/UserInfoDTO";

/**
 * Composant d'affichage du profil utilisateur dans le dashboard.
 * Affiche les informations principales de l'utilisateur connecté.
 */
export default function ProfileSection() {
    // État pour stocker les informations de l'utilisateur
    const [userInfo, setUserInfo] = useState<UserInfoDTO | null>(null);
    // Récupération de l'email de l'utilisateur connecté
    const userEmail = getUserEmail();

    /**
     * Effet pour charger les informations de l'utilisateur au montage du composant
     * et lorsque l'email change.
     * Récupère les données via le service utilisateur.
     */
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userEmail) {
                try {
                    const info = await getUserInfo(userEmail);
                    setUserInfo(info);
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            }
        };

        fetchUserInfo();
    }, [userEmail]);

    /**
     * Rendu du profil avec :
     * - Photo de profil
     * - Rôle de l'utilisateur (User, Agent, Admin)
     * - Nom complet
     * - Email avec lien mailto
     * Le style est responsive avec des ajustements pour différentes tailles d'écran
     */
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                {/* Avatar */}
                <div className="mb-6 md:mb-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-secondary-color flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <span className="text-4xl text-white font-bold">
                            {userInfo?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="md:ml-10 text-center md:text-left">
                    <h6 className="text-sm text-secondary-color font-bold mb-2">
                        {userInfo?.role?.toLowerCase() === 'user' ? 'User' : 
                         userInfo?.role?.toLowerCase() === 'agent' ? 'Real Estate Agent' : 
                         userInfo?.role?.toLowerCase() === 'admin' ? 'Administrator' : 
                         'Unknown Role'}
                    </h6>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-heading-color mb-4">
                        {userInfo?.name}
                    </h2>

                    <a 
                        className="inline-flex items-center gap-3 text-gray-600 hover:text-secondary-color transition-colors duration-200" 
                        href={`mailto:${userInfo?.email}`}
                    >
                        <i className="icon-mail text-xl"></i>
                        <span>{userInfo?.email}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
