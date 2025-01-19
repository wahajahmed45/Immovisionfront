
import { UserInfoDTO } from "@/types/User/UserInfoDTO";
import AuthService from "../authentication/AuthServices";
import { UpdateUserDTO } from "@/types/User/UpdateUserDTO";



export const getAgentsEmails = async (): Promise<string[]> => {
  try {
    const instance = AuthService.getAuthenticatedAxios();
    const response = await instance.get('/api/users/agents');
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

export const assignAgentToProperty = async (propertyId: string, agentEmail: string): Promise<string> => {
  try {
    const instance = AuthService.getAuthenticatedAxios();
    const response = await instance.put(`/properties/${propertyId}/agent`, { agentEmail });
    return response.data;
  } catch (error) {
    console.error('Error assigning agent to property:', error);
    throw error;
  }
};

export const getUserInfo = async (email: string): Promise<UserInfoDTO> => {
  try {
    const instance = AuthService.getAuthenticatedAxios();
    const response = await instance.get('/api/users/info', {
      params: { email: email }  
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const changePassword = async(email: string, currentPassword: string, newPassword: string): Promise<boolean>=>{
  try {
    const instance = AuthService.getAuthenticatedAxios();
    const response = await instance.post(`/api/auth/change-password`, {
      email,
      currentPassword,
      newPassword
    }, { withCredentials: true });

    return response.status === 200; 
  } catch (error) {
    console.error('Change password failed:', error);
    throw new Error('An unexpected error occurred');
  }
}

export const updateUser = async (updateData: UpdateUserDTO): Promise<UserInfoDTO> => {
  try {
    const instance = AuthService.getAuthenticatedAxios();
    const response = await instance.put('/api/users/update', updateData, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An unexpected error occurred while updating user information');
  }
}
