// Setup para tests
import { beforeAll, afterAll } from 'bun:test';

// Mock de variables de entorno para tests
process.env.VITE_API_URL = 'http://localhost:3001/api';
process.env.VITE_MERCADOPAGO_PUBLIC_KEY = 'TEST-public-key';
process.env.VITE_MERCADOPAGO_ACCESS_TOKEN = 'TEST-access-token';
process.env.VITE_BASE_URL = 'http://localhost:5174';

// Mock de import.meta.env para tests
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:3001/api',
      VITE_MERCADOPAGO_PUBLIC_KEY: 'TEST-public-key',
      VITE_MERCADOPAGO_ACCESS_TOKEN: 'TEST-access-token',
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
