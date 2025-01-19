import {AgentData} from "@/types/AgentData";
import {AddressData} from "@/types/AddressData";
import {CommodityData} from "@/types/Commodity";

export interface PropertyData {
    property_id: string;
    title: string;
    status: string;
    price: number;
    location: string;
    commodities: CommodityData[];
    propertyIllustration: string;
    //agent: AgentData;
    agent: string;
    datetime: string;
    description: string;

    propertyType: 'House' | 'Single Family' | 'Apartment' | 'Office Villa' | 'Luxury Home' | 'Studio';
    amenities: ('Dishwasher' | 'Floor Coverings' | 'Internet' | 'Build Wardrobes' | 'Supermarket' | 'Kids Zone')[];
    bedrooms: number;
    bathrooms: number;
    category: 'Buying' | 'Renting' | 'Selling' | 'Leasing';
}
