import { dev } from '$app/environment';

// Import values from package.json
export const googleSheet = {
  id: '1lsXt4nXsz9k52bW79KxSLRK3Lg30z8U9AcuPNUHUVNY',
  gid: '1265603145'
};

// Add any other configuration values you need
export const config = {
  googleSheet,
  baseUrl: dev ? '/' : '/blr-city-officials/'
};
