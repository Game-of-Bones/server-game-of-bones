// Configuración de JWT
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
