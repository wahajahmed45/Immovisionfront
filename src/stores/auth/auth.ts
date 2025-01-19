'use client';

// Utility to check if running in a browser environment
const isBrowser = (): boolean => typeof window !== 'undefined';

// Function to store JWT token in local storage
export const storeToken = (token: string): void => {
  if (isBrowser()) {
    localStorage.setItem('token', token);
  }
};

// Function to retrieve JWT token from local storage
export const getToken = (): string | null => {
  if (isBrowser()) {
    return localStorage.getItem('token');
  }
  return null;
};

// Function to remove JWT token and related data from local storage
export const removeToken = (): void => {
  if (isBrowser()) {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userAcls');
  }
};

export const storeUserData = (role: string, acls: string[],emailUser:string): void => {
  if (isBrowser()) {
    localStorage.setItem('userRole', role);
    localStorage.setItem('userAcls', JSON.stringify(acls));
    localStorage.setItem('emailUser', emailUser);
  }
};

// Function to retrieve user role from local storage
export const getUserRole = (): string | null => {
  if (isBrowser()) {
    return localStorage.getItem('userRole');
  }
  return null;
};

// Function to retrieve user ACLs from local storage
export const getUserAcls = (): string[] => {
  if (isBrowser()) {
    const acls = localStorage.getItem('userAcls');
    return acls ? JSON.parse(acls) : [];
  }
  return [];
};

export const getUserEmail= (): string | null => {
  if (isBrowser()) {
    return localStorage.getItem('emailUser');
  }
  return null;
};

// Function to check if the user has a specific permission (ACL)
export const hasPermission = (acl: string): boolean => {
  const userAcls = getUserAcls();
  return userAcls.includes(acl);
};

// Function to check if the user has a specific role
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};