// Test environment setup
process.env.JWT_SECRET = "test-secret-key-that-is-at-least-32-characters-long";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.PORT = "3335";
process.env.NODE_ENV = "test";