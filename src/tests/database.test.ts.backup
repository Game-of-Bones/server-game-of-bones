import testPool, { testConnection } from '../config/database.test';

describe('Database Connection', () => {
  
  test('should connect to test database successfully', async () => {
    await expect(testConnection()).resolves.not.toThrow();
  });

  test('should execute a simple query', async () => {
    const [rows] = await testPool.query('SELECT 1 + 1 AS result');
    expect(rows).toBeDefined();
    expect(Array.isArray(rows)).toBe(true);
  });

  test('should show test database exists', async () => {
    const [rows]: any = await testPool.query('SHOW DATABASES LIKE ?', ['game_of_bones_app_test']);
    expect(rows.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await testPool.end();
  });
});