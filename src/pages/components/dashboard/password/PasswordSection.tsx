import { useState } from "react";
import { getUserEmail } from "@/stores/auth/auth";
import { changePassword } from "@/services/user/UserServices";

/**
 * Composant permettant à l'utilisateur de changer son mot de passe.
 * Gère la validation et la mise à jour du mot de passe via le service utilisateur.
 */
export default function PasswordSection() {
    // États pour les champs du formulaire
    const [currentPassword, setCurrentPassword] = useState("");     // Mot de passe actuel
    const [newPassword, setNewPassword] = useState("");            // Nouveau mot de passe
    const [confirmPassword, setConfirmPassword] = useState("");    // Confirmation du nouveau mot de passe
    const [errorMessage, setErrorMessage] = useState("");          // Message d'erreur éventuel

    /**
     * Gère la soumission du formulaire de changement de mot de passe.
     * Vérifie que les nouveaux mots de passe correspondent et appelle le service de mise à jour.
     * @param e - Événement de soumission du formulaire
     */
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation des mots de passe
        if (newPassword !== confirmPassword) {
            setErrorMessage("New passwords do not match.");
            return;
        }

        try {
            // Appel au service de changement de mot de passe
            const success = await changePassword(getUserEmail() ?? "", currentPassword, newPassword);
            if (success) {
                alert("Password changed successfully!");
                // Réinitialisation du formulaire après succès
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setErrorMessage("");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            setErrorMessage("Failed to change password. Please try again.");
        }
    };

    /**
     * Rendu du formulaire avec :
     * - Champ pour le mot de passe actuel
     * - Champ pour le nouveau mot de passe
     * - Champ de confirmation
     * - Affichage des erreurs
     * - Bouton de soumission
     */
    return (
        <div className="transition-all duration-300">
            <form className="form-primary bg-white px-25px md:px-50px pt-10 pb-50px" onSubmit={handleChangePassword}>
                <div>
                    <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-30px">
                        <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">Change Password</span>
                    </h5>
                    <div className="grid grid-cols-1 gap-30px pb-30px">
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Current Password*"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="text-paragraph-color pr-5 pl-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60 tracking-[3px]"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="New Password*"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="text-paragraph-color pr-5 pl-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60 tracking-[3px]"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Confirm New Password*"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="text-paragraph-color pr-5 pl-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60 tracking-[3px]"
                            />
                        </div>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
                <div>
                    <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border bg-secondary-color border-secondary-color hover:border-primary-color hover:bg-primary-color inline-block z-0">
                        <button
                            type="submit"
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-white leading-23px uppercase h"
                        >
                            Save Changes
                        </button>
                    </h5>
                </div>
            </form>
        </div>
    );
}
