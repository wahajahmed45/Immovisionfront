export type FeaturedProperty = {
    id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    country: string;
    city: string;
    zip: string;
    type: string;
    roomCount: number;
    isAvailable: boolean;
    forRent: boolean;
    status: string;
    area: number;
    bathroom: number;
    latitude?: number;
    longitude?: number;
}