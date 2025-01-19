export interface AddressData {

    residenceNumber: string;        // 251
    street: string;                 // Jean-Volders
    city: string;                   // Oupeye
    postalCode: string;             // 4683
    region?: string;                // Province de Liège
    country: string;                // Belgique
    longitude: number;              // Longitude utilisée pour lier à Google Maps
    latitude: number;               // Latitude utilisée pour lier à Google Maps

    /**
     * Formatte l'adresse selon le format spécifié (FR pour le format français et US pour le format américain).
     *
     * @param format        Code ISO du format d'adresse souhaité.
     * @returns             String représentant l'adresse formatée.
     */
    formatAddress(format: string /*"FR" | "US"*/): string;

}
