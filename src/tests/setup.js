// Setup para tests
import { beforeAll, afterAll } from 'bun:test';

// Mock de variables de entorno para tests
process.env.VITE_API_URL = 'https://sillage-backend-5sy1sfkqw-sillageperfums-projects.vercel.app/api/';

process.env.VITE_BASE_URL = 'http://localhost:5174';

// Mock de import.meta.env para tests
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'https://sillage-backend-5sy1sfkqw-sillageperfums-projects.vercel.app/api/',
      VITE_BASE_URL: 'http://localhost:5174'
    }
  }
};

// Mock de console para tests limpios
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};
