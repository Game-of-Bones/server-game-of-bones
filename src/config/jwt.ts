/**
 * JWT CONFIGURATION
 *
 * Configuración de JSON Web Tokens para autenticación
 */

export const jwtConfig: {
  secret: string;
  expiresIn: string;
} = {
  secret: process.env.JWT_SECRET || 'change_this_secret_in_production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

// Validar que el secret sea seguro en producción
if (
  process.env.NODE_ENV === 'production' &&
  jwtConfig.secret === 'change_this_secret_in_production'
) {
  throw new Error('⚠️  JWT_SECRET debe estar configurado en producción');
}
