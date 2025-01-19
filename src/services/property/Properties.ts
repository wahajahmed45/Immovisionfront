import axios, { AxiosInstance } from 'axios';
import { PropertyData } from '@/types/PropertyData';
import {AddressData} from "@/types/AddressData";
// import config from '@/utils/config';

// export const getAuthenticatedAxiosInstance = (): AxiosInstance => {
//     const token = getToken();
//
//     const instance = axios.create();
//     if (token) {
//         instance.defaults.headers['Authorization'] = `Bearer ${token}`;
//     }
//
//     return instance;
// };

const formatAddress = function (address: AddressData, format: string): string {
    switch (format) {
        // TODO: Add region to the address
        case "FR":
            return `${address.residenceNumber} ${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
        case "US":
            return `${address.street} ${address.residenceNumber}, ${address.city}, ${address.postalCode}, ${address.country}`;
        default:
            return `${address.residenceNumber} ${address.street}, ${address.city}, ${address.country}`;
    }
};

