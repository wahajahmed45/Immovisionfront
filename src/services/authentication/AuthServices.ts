import axios, { AxiosInstance } from 'axios';
import { UserData } from '@/types/User/UserData';
import { RegisterData } from '@/types/User/RegisterData';
import { AuthResponse } from '@/types/User/AuthResponse';
import config from '@/utils/config';
import { removeToken, storeUserData } from '@/stores/auth/auth';
import Cookies from 'js-cookie';

interface ErrorResponse {
  message: string;
  error: string;
}

class AuthService {

 static setAuthCookie(token: string): void {
    Cookies.set('access_token', token, { secure: true, sameSite: 'Strict' });
  }

 
  static getAuthToken(): string | null {
   
    return Cookies.get('access_token') || null;
  }
 
  private static clearAuthCookie(): void {
    Cookies.remove('access_token');
  }

  
  static async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post<AuthResponse>(
        `${config.apiBaseUrl}/api/auth/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { token, role, acls, emailUser } = response.data;

      
      AuthService.setAuthCookie(token);

      
      storeUserData(role, acls,emailUser);

      return true;
    } catch (error) {
      console.error('Login failed:', error);

      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as ErrorResponse;
        throw new Error(errorData.message || 'Login failed');
      }

      throw new Error('An unexpected error occurred');
    }
  }


  static async signup(userData: RegisterData)  {
    try {
      const response = await axios.post<AuthResponse>(
        `${config.apiBaseUrl}/api/users/register`,
        userData,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.error('Signup failed:', error);

      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Signup failed');
      }

      throw new Error('Signup failed');
    }
  }

  // Handle user logout
  static async logout(): Promise<void> {
    try {
     // await axios.post(`${config.apiBaseUrl}/api/auth/logout`, {}, { withCredentials: true });

     
      
      this.clearAuthCookie();
      removeToken();
      localStorage.clear();
      window.location.href = '/';

      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }


  static getAuthenticatedAxios(): AxiosInstance {
    const instance = axios.create({
      baseURL: config.apiBaseUrl,
      withCredentials: true,  
    });

  
    instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Request Config:', config);
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    instance.interceptors.response.use(
      (response) => {
        console.log('Response:', response);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        console.error('Error Response:', error.response);
    
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
    
          try {
            const refreshResponse = await axios.post(
              `${config.apiBaseUrl}/api/auth/refresh`,
              {},
              { withCredentials: true }
            );
            const { token: newToken } = refreshResponse.data;
    
            this.setAuthCookie(newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
    
            return instance(originalRequest);
          } catch (refreshError) {
            //this.logout();
            //window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
    
        return Promise.reject(error);
      }
    );

    return instance;
  }

  // Fetch user-specific protected data
  static async fetchUserData(): Promise<UserData> {
    try {
      const instance = this.getAuthenticatedAxios();
      const response = await instance.get('/protected-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  static async forgotPassword(email: string): Promise<boolean> {
    try {
        const response = await axios.post(
            `${config.apiBaseUrl}/api/users/forgot-password`,
            null,
            {
                params: { email },
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Password reset failed:', error);

        if (axios.isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            throw new Error(errorData.message || 'Password reset failed');
        }

        throw new Error('An unexpected error occurred');
    }
  }

}

export default AuthService;