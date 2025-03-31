// src/services/authService.ts
import { userApi } from './api';

export const authService = {
    async login(firstName: string, lastName: string, email: string): Promise<string> {
      try {
        console.log(`Checking if user exists: ${firstName} ${lastName} with email: ${email}`);
        const userResponse = await userApi.get(`/users/id/${firstName}/${lastName}`);
        
        console.log(`User found, ID: ${userResponse.data.id}`);
        return userResponse.data.id;  
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          const errorMessage = error.response.data?.message || "";
          
          if (errorMessage.includes("User with name")) {
            console.log(`User not found, creating new user...`);
            const createResponse = await userApi.post('/users', { firstName, lastName, email });
            return createResponse.data.id;
          }
        }
  
        console.error('Login error:', error);
        throw error;
      }
    },
  };