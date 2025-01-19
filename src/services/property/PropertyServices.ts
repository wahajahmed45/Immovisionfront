import { FeaturedProperty } from '@/types/Property/FeaturedProperty';
import { PropertyDashboardDTO } from '@/types/Property/PropertyDashboardDTO';
import { PropertyDTO } from '@/types/PropertyDTO';
import config from '@/utils/config';
import axios from "axios";
import {PropertyData} from "@/types/PropertyData";
import {ApiResponse} from "@/types/ApiResponse";
import { getToken } from '@/stores/auth/auth';
import { getUserRole } from '@/stores/auth/auth';
import { UpdatePropertyDTO } from '@/types/UpdatePropertyDTO';
import { Filters } from '@/types/Property/Filters';

interface PropertyResponse {
  id: string;
  message: string;
  property: PropertyDTO;
}


export const getProperties = async (): Promise<FeaturedProperty[]> => {
  const response = await fetch(`${config.apiBaseUrl}/properties/featured`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
  return response.json();
};


export const getPropertiesByCity = async (): Promise<Map<string, FeaturedProperty[]>> => {
  const response = await fetch(`${config.apiBaseUrl}/properties/cities`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
  const data: Map<string, FeaturedProperty[]> = await response.json();
  return data;
};

export const getPendingProperties = async (): Promise<PropertyDashboardDTO[]> => {
  const response = await fetch(`${config.apiBaseUrl}/properties/pending-properties`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
 
  return response.json();
};

export const getFavoriteProperties = async (email: string): Promise<PropertyDashboardDTO[]> => {
  const response = await fetch(`${config.apiBaseUrl}/properties/favorite/get/${email}`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
  return response.json();
};

export const addFavoriteProperty = async (propertyId: string, email: string): Promise<void> => {
  const response = await fetch(`${config.apiBaseUrl}/properties/favorite/add/${propertyId}?email=${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to add property to favorites");
  }
};

export const removeFavoriteProperty = async (propertyId: string, email: string): Promise<void> => {
  const response = await fetch(`${config.apiBaseUrl}/properties/favorite/remove/${propertyId}?email=${email}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to remove property from favorites");
  }
};

export const isAlreadyAdded = async (propertyId: string, email: string): Promise<boolean> => {
  const response = await fetch(`${config.apiBaseUrl}/properties/favorite/check/${propertyId}?email=${email}`);
  if (!response.ok) {
    throw new Error("Failed to check if property is already added to favorites");
  }
  return response.json();
};


export const createProperty = async (propertyData: PropertyDTO): Promise<PropertyResponse> => {
  const formData = new FormData();
  const token = localStorage.getItem('token');

  // Format the date correctly before sending
  const formattedData = {
    ...propertyData,
    availableFrom: propertyData.availableFrom ? new Date(propertyData.availableFrom).toISOString().split('T')[0] : null
  };

  const propertyDataWithoutImages = { ...formattedData } as Partial<PropertyDTO>;
  delete propertyDataWithoutImages.images;
  delete propertyDataWithoutImages.imageUrl;

  formData.append('data', JSON.stringify(propertyDataWithoutImages));

  // Gérer les images
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach((image: File) => {
      formData.append('images', image);
    });
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/properties/create`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json() as { message: string };
      throw new Error(errorData.message || 'Failed to create property');
    }

    return response.json() as Promise<PropertyResponse>;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const validatePropertyData = (data: PropertyDTO): string[] => {
  const errors: string[] = [];

  if (!data.title) errors.push('Title is required');
  if (!data.description) errors.push('Description is required');
  if (!data.price || data.price <= 0) errors.push('Valid price is required');
  if (!data.location) errors.push('Location is required');
  if (!data.type) errors.push('Property type is required');
  if (!data.imageUrl || data.imageUrl.length === 0) errors.push('At least one image is required');
  if (!data.roomCounts) errors.push('Number of rooms is required');
  if (!data.bathroom) errors.push('Number of bathrooms is required');
  if (!data.livingArea || data.livingArea <= 0) errors.push('Valid area is required');
  if (!data.landArea || data.landArea <= 0) errors.push('Area is required and must be greater than 0');
  return errors;
};

export const getPropertyById = async (propertiyId: string): Promise<PropertyDTO | null> => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/properties/${propertiyId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Propriété non trouvée
      }
      if (response.status === 401) {
        return null; // Utilisateur non authentifié
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

export const handlePropertyApproval = async (
  propertyId: string,
  isApproved: boolean,
  comment: string = "",
  agentEmail: string
): Promise<boolean> => {
  try {


    const url = new URL(`${config.apiBaseUrl}/properties/approve/${propertyId}`);
    url.searchParams.append('approved', isApproved.toString());
    url.searchParams.append('comment', comment);
    url.searchParams.append('agentEmail', agentEmail);

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to approve property");
    }

    return true;
  } catch (error) {
    console.error("Erreur détaillée lors de l'approbation:", error);
    throw error;
  }
};

export const searchProperties = async (criteria: Partial<PropertyDTO>): Promise<PropertyDTO[]> => {
  const queryParams = new URLSearchParams();

  Object.entries(criteria).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const response = await fetch(`${config.apiBaseUrl}/properties/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties matching criteria");
  }
  return response.json();
};




// export const searchProperties = async (criteria: Partial<PropertyDTO> & {
//   priceRange?: [number, number],
//   areaRange?: [number, number],
//   types?: string[]
// }): Promise<PropertyDTO[]> => {
//   const queryParams = new URLSearchParams();
//
//   Object.entries(criteria).forEach(([key, value]) => {
//     if (key === 'priceRange' && value) {
//       queryParams.append('minPrice', value[0].toString());
//       queryParams.append('maxPrice', value[1].toString());
//     } else if (key === 'areaRange' && value) {
//       queryParams.append('minArea', value[0].toString());
//       queryParams.append('maxArea', value[1].toString());
//     } else if (key === 'types' && Array.isArray(value)) {
//       value.forEach((type) => queryParams.append('types', type));
//     } else if (value) {
//       queryParams.append(key, value.toString());
//     }
//   });
//
//   const response = await fetch(`${config.apiBaseUrl}/properties/search?${queryParams.toString()}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch properties matching criteria");
//   }
//   return response.json();
// };

export async function getPropertiesSearch(queryParams: Record<string, string> = {}): Promise<ApiResponse | null> {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${config.apiBaseUrl}/properties${queryString ? '?' + queryString : ''}`;

    const response = await axios.get<ApiResponse>(url);

    if (process.env.MODE_ENV === 'development') {
      console.log('Data:', response.data);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    return null;
  }

}

export async function getMaxPrice(): Promise<number> {
  try {
    const response = await axios.get<number>(`http://localhost:8080/properties/max-price`);
    console.log(`Max price: ${response.data}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return .0;
  }
}

export async function getMinPrice(): Promise<number> {
  try {
    const response = await axios.get<number>(`http://localhost:8080/properties/min-price`);
    console.log(`Min price: ${response.data}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return .0;
  }
}

// export default async function addFavorite(req, res) {
//   if (req.method === 'POST') {
//     const { userId, propertyId } = req.body;
//
//     try {
//       // TODO: Add property to user's favorites
//       console.log(`Add to favorites: userId=${userId}, propertyId=${propertyId}`);
//
//       return res.status(200).json({ success: true, message: 'Property added to favorites.' });
//     } catch (error) {
//       console.error('API Error:', error);
//       return res.status(500).json({ success: false, message: 'Internal server error.' });
//     }
//   }
//
//   res.setHeader('Allow', ['POST']);
//   res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
// }
//
// export default async function removeFavorite(req, res) {
//     if (req.method === 'POST') {
//       const {userId, propertyId} = req.body;
//
//       try {
//         // TODO: Remove property from user's favorites
//         console.log(`Remove from favorites: userId=${userId}, propertyId=${propertyId}`);
//
//         return res.status(200).json({success: true, message: 'Property removed from favorites.'});
//       } catch (error) {
//         console.error('API Error:', error);
//         return res.status(500).json({success: false, message: 'Internal server error.'});
//       }
//     }
//
//     res.setHeader('Allow', ['POST']);
//     res.status(405).json({success: false, message: `Method ${req.method} not allowed.`});
// }

export const getUserProperties = async (email: string): Promise<PropertyDashboardDTO[]> => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/properties/user/${email}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user properties');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching user properties:', error);
        throw error;
    }
};

export const getAgentProperties = async (email: string): Promise<PropertyDashboardDTO[]> => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/properties/agent/${email}`);
        if (!response.ok) {
            throw new Error('Failed to fetch agent properties');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching agent properties:', error);
        throw error;
    }
};

export const deleteUserProperty = async (email: string, propertyId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/properties/user/${email}/property/${propertyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete property');
        }
        return true;
    } catch (error) {
        console.error('Error deleting property:', error);
        throw error;
    }
};

export const updateProperty = async (id: string, updateDTO: UpdatePropertyDTO): Promise<void> => {
  try {
    const formData = new FormData();
    const token = getToken();

    // Format the date correctly before sending
    const formattedData = {
      ...updateDTO,
      availableFrom: updateDTO.availableFrom ? new Date(updateDTO.availableFrom).toISOString().split('T')[0] : null
    };

    // Remove images from the main data object
    const dataWithoutImages = { ...formattedData } as Partial<typeof formattedData>;
    delete dataWithoutImages.images;

    // Append the main data
    formData.append('data', JSON.stringify(dataWithoutImages));

    // Append new images if any
    if (updateDTO.images && updateDTO.images.length > 0) {
      updateDTO.images.forEach((image: File) => {
        formData.append('images', image);
      });
    }

    // Append images to delete if any
    if (updateDTO.imagesToDelete && updateDTO.imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(updateDTO.imagesToDelete));
    }

    const response = await fetch(`${config.apiBaseUrl}/properties/update/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update property');
    }
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string): Promise<boolean> => {
  try {
      const response = await axios.delete(`${config.apiBaseUrl}/properties/delete/${propertyId}`);
      return response.status === 200;
  } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
  }
};
export const filterProperties = async (filters: Filters): Promise<FeaturedProperty[]> => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const response = await fetch(`${config.apiBaseUrl}/properties/filter?${queryParams.toString()}`);
  if (!response.ok) { 
    throw new Error("Failed to fetch filtered properties");
  }
  return response.json();
};

export const getCities = async () => {
  const response = await fetch(`${config.apiBaseUrl}/properties/all/cities`); 
  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }
  return response.json();
};



