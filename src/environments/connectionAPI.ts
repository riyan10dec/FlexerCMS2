export const connectionAPI = {
    apiURL: 'http://flexerapi.southeastasia.cloudapp.azure.com:2345',
};

interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'YOUR-AUTH0-CLIENT-ID',
  CLIENT_DOMAIN: 'YOUR-AUTH0-DOMAIN.auth0.com',
  AUDIENCE: 'YOUR-AUTH0-API-IDENTIFIER',
  REDIRECT: 'http://localhost:4200/#/auth/login',
  SCOPE: 'openid',
};
