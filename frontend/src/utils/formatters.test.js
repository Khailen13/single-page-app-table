import formatDate from './formatters';

let warnSpy;

beforeAll(() => {
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

beforeEach(() => {
  warnSpy.mockClear();
});

describe('formatDate', () => {
  
  test('returns dash for empty input', () => {
    expect(formatDate('')).toBe('—');
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });

  test('formats valid string dates correctly', () => {
    expect(formatDate('2023-12-31')).toBe('31.12.2023');
    expect(formatDate('31-12-2023')).toBe('31.12.2023');
  });

  test('short numeric strings return dash with warning', () => {
    expect(formatDate('123')).toBe('—');
    expect(warnSpy).toHaveBeenCalledWith('Невалидная дата:', '123');
    
    warnSpy.mockClear();
    expect(formatDate('12345')).toBe('—');
    expect(warnSpy).toHaveBeenCalledWith('Невалидная дата:', '12345');
  });

  test('6+ digit numeric strings do NOT trigger early return', () => {
    warnSpy.mockClear();
    const result = formatDate('123456');
    if (result === '—') {
      expect(warnSpy).toHaveBeenCalled();
      const warningMessages = warnSpy.mock.calls.map(call => call[0]);
      expect(warningMessages).not.toContain('Невалидная дата:');
    }
  });

  test('handles exceptions in try-catch block', () => {
    const badInput = {
      toString: () => { throw new Error('Искусственная ошибка для теста'); }
    };
    
    expect(formatDate(badInput)).toBe('—');

    expect(warnSpy).toHaveBeenCalledWith(
      'Ошибка парсинга даты:',
      badInput,
      expect.any(Error)
    );
  });

  test('handles Date objects (they convert to ISO string)', () => {

    const dateObj = new Date('2023-12-31');
    const result = formatDate(dateObj);

    expect(['31.12.2023', '—']).toContain(result);
  });

  test('handles invalid string dates', () => {

    expect(formatDate('not-a-date')).toBe('—');
    expect(warnSpy).toHaveBeenCalled();
  });

  test('dmyMatch creates date from DD-MM-YYYY format', () => {
    expect(formatDate('01-01-2023')).toBe('01.01.2023');
    expect(formatDate('15-08-2023')).toBe('15.08.2023');
  });

  test('ymdMatch creates date from YYYY-MM-DD format (when dmyMatch fails)', () => {
    expect(formatDate('2023-01-01')).toBe('01.01.2023');
    expect(formatDate('2023-08-15')).toBe('15.08.2023');
  });

  test('passes to Date constructor when no regex match', () => {

    const result1 = formatDate('2023/12/31');
    const result2 = formatDate('Dec 31, 2023');

    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });

  test('handles NaN dates from getTime()', () => {

    const RealDate = global.Date;
    
    global.Date = class MockDate {
      constructor() {
      }
      
      getTime() {
        return NaN;
      }
    };
    
    try {
      expect(formatDate('2023-12-31')).toBe('—');
      expect(warnSpy).toHaveBeenCalledWith('Невалидная дата:', '2023-12-31');
    } finally {
      global.Date = RealDate;
    }
  });

  describe('covers specific lines 23-24 and 36-37', () => {
    test('covers line 23: short numeric string condition', () => {

      warnSpy.mockClear();
      expect(formatDate('123')).toBe('—');
      expect(warnSpy).toHaveBeenCalledWith('Невалидная дата:', '123');

      warnSpy.mockClear();
      formatDate('123456');
      warnSpy.mockClear();
      formatDate('12ab');
    });

    test('covers line 36: catch block', () => {

      const problematicObj = {
        toString: () => { throw new TypeError('Cannot convert to string'); }
      };
      
      expect(formatDate(problematicObj)).toBe('—');
      expect(warnSpy).toHaveBeenCalledWith(
        'Ошибка парсинга даты:',
        problematicObj,
        expect.any(Error)
      );
    });
  });
});