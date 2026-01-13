const originalEnv = process.env;

describe('api', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('is configured axios instance', () => {
    const api = require('./api').default;
    
    expect(api).toBeDefined();
    expect(typeof api.get).toBe('function');
    expect(api.defaults.timeout).toBe(10000);
  });

  test('has baseURL for development environment', () => {
    process.env.NODE_ENV = 'development';
    
    const api = require('./api').default;
    
    expect(api.defaults.baseURL).toBe('http://localhost:8000/spa');
  });

  test('has baseURL for production environment', () => {
    process.env.NODE_ENV = 'production';
    
    const api = require('./api').default;
    
    expect(api.defaults.baseURL).toBe('/spa');
  });

  test('has baseURL when NODE_ENV is undefined', () => {
    delete process.env.NODE_ENV;
    
    const api = require('./api').default;

    expect(api.defaults.baseURL).toBe('/spa');
  });

  test('has baseURL when NODE_ENV is any other value', () => {
    const testCases = ['test', 'staging', 'preprod', '', null, false];
    
    testCases.forEach(envValue => {
      jest.resetModules();
      process.env.NODE_ENV = envValue;
      
      const api = require('./api').default;
      expect(api.defaults.baseURL).toBe('/spa');
    });
  });

  test('covers all branches of ternary operator at line 4', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    let api = require('./api').default;
    expect(api.defaults.baseURL).toBe('http://localhost:8000/spa');

    const otherValues = ['production', 'test', undefined, null, ''];
    
    otherValues.forEach(value => {
      jest.resetModules();
      if (value === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = value;
      }
      
      api = require('./api').default;
      expect(api.defaults.baseURL).toBe('/spa');
    });
  });
});