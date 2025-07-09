// Setup para tests
import { beforeAll, afterAll } from 'bun:test';

// Mock de variables de entorno para tests
process.env.VITE_SUPABASE_URL = 'https://test-supabase-url.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VITE_MERCADOPAGO_PUBLIC_KEY = 'TEST-public-key';
process.env.VITE_MERCADOPAGO_ACCESS_TOKEN = 'TEST-access-token';
process.env.VITE_BASE_URL = 'http://localhost:5174';

// Mock de import.meta.env para tests
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: 'https://test-supabase-url.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      VITE_MERCADOPAGO_PUBLIC_KEY: 'TEST-public-key',
      VITE_MERCADOPAGO_ACCESS_TOKEN: 'TEST-access-token',
      VITE_BASE_URL: 'http://localhost:5174'
    }
  }
};

// Mock de Supabase para tests
const mockSupabase = {
  from: (table) => ({
    select: () => ({ single: () => ({ data: null, error: null }) }),
    insert: () => ({ select: () => ({ data: [], error: null }) }),
    update: () => ({ eq: () => ({ select: () => ({ data: [], error: null }) }) }),
    delete: () => ({ eq: () => ({ data: [], error: null }) })
  }),
  auth: {
    getSession: () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
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
