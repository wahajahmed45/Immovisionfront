import {PropertyData} from "@/types/PropertyData";

export interface ApiResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    properties: PropertyData[];
}
