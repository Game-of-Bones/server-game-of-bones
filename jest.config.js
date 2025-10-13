/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  //Añadimos rutas más específicas:
   roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  //Añadimos congiguración de transformación:
  transform: {
     '^.+\\.ts$': 'ts-jest',
  },
  //Configuración de cobertura:
   collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/server.ts',
    '!src/database/seed.ts',
    '!src/database/initTest.ts',
    '!src/server/script/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  //Configuración de comportamiento
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  detectOpenHandles: true,

  //Setup global antes de tests
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
