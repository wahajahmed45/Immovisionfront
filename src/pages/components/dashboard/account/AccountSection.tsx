import { useEffect, useState } from "react";
import { getUserEmail } from "@/stores/auth/auth";
import { getUserInfo, updateUser } from "@/services/user/UserServices";
import { UserInfoDTO } from "@/types/User/UserInfoDTO";
import { UpdateUserDTO } from "@/types/User/UpdateUserDTO";
import { storeUserData } from "@/stores/auth/auth";

interface AccountSectionProps {
    updateUserInfo: (newUserInfo: UserInfoDTO) => void;
}

/**
 * Composant de gestion des informations du compte utilisateur.
 * Permet de visualiser et modifier les informations personnelles.
 */
export default function AccountSection({ updateUserInfo }: { updateUserInfo: (newUserInfo: UserInfoDTO) => void }) {
    // État pour stocker les informations de l'utilisateur
    const [userInfo, setUserInfo] = useState<UserInfoDTO | null>(null);
    // Récupération de l'email de l'utilisateur connecté
    const userEmail = getUserEmail();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [updateError, setUpdateError] = useState('');

    /**
     * Effet pour charger les informations de l'utilisateur au montage du composant
     * et lorsque l'email change.
     */
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userEmail) {
                try {
                    const info = await getUserInfo(userEmail);
                    setUserInfo(info);
                    const [first, ...last] = info.name.split(' ');
                    setFirstName(first || '');
                    setLastName(last.join(' ') || '');
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            }
        };

        fetchUserInfo();
    }, [userEmail]);

    /**
     * Gère la soumission du formulaire de modification des informations.
     * @param e - Événement de soumission du formulaire
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateError("");

        if (!userEmail) {
            setUpdateError("User email is required");
            return;
        }

        try {
            const updateData: UpdateUserDTO = {
                email: userEmail,
                newEmail: userEmail,
                name: `${firstName} ${lastName}`.trim()
            };

            const updatedUser = await updateUser(updateData);
            setUserInfo(updatedUser);
            updateUserInfo(updatedUser);
            alert("Profil mis à jour avec succès !");
        } catch (error: any) {
            setUpdateError(error.message);
        }
    };

    // Rendu du formulaire avec les champs prénom, nom et email
    return (
        <div className="transition-all duration-300">
            <form className="form-primary bg-white" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-30px mb-20">
                    <div className="relative">
                        <p className="text-sm lg:text-base">
                            <span className="leading-1.8 lg:leading-1.8">First name:</span>
                        </p>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="text-paragraph-color pr-5 pl-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none"
                        />
                    </div>
                    <div className="relative">
                        <p className="text-sm lg:text-base">
                            <span className="leading-1.8 lg:leading-1.8">Last name:</span>
                        </p>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="text-paragraph-color pr-5 pl-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none"
                        />
                    </div>
                    <div className="relative">
                        <p className="text-sm lg:text-base">
                            <span className="leading-1.8 lg:leading-1.8">Email:</span>
                        </p>
                        <input
                            type="email"
                            value={userEmail || ''}
                            disabled
                            className="text-paragraph-color pr-5 pl-50px outline-none border-2 border-gray-200 bg-gray-100 h-65px block w-full rounded-none cursor-not-allowed"
                        />
                    </div>
                </div>
                {updateError && (
                    <div className="text-red-500 mb-4">
                        {updateError}
                    </div>
                )}
                <div>
                    <button
                        type="submit"
                        className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border bg-secondary-color border-secondary-color hover:border-primary-color hover:bg-primary-color inline-block z-0 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
