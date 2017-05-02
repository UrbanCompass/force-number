import forceNumber from '../index.js';

describe('forceNumber', () => {
  it('should force values to numbers using forceNumber()', () => {
    expect(forceNumber(25)).toBe(25);
    expect(forceNumber(NaN)).toBeNaN();
  });

  it('should force booleans to 1 or 0', () => {
    expect(forceNumber(true)).toBe(1);
    expect(forceNumber(false)).toBe(0);
  });

  it('should force different strings to Number', () => {
    expect(forceNumber('USD$ 123.47')).toBe(123.47);
    expect(forceNumber('(100,000¥)')).toBe(-100000);
    expect(forceNumber('12/31/2007')).toBe(12312007);
    expect(forceNumber('5 tenths')).toBe(5);
    expect(forceNumber('5 meters')).toBe(5);
  });

  it('should support e notation', () => {
    expect(forceNumber('7e4')).toBe(70000);
  });

  it('should support thousands notation', () => {
    expect(forceNumber('5k')).toBe(5000);
    expect(forceNumber('5K')).toBe(5000);
    expect(forceNumber('5 thousand')).toBe(5000);
  });

  it('should support millions notation', () => {
    expect(forceNumber('5M')).toBe(5000000);
    expect(forceNumber('5m')).toBe(5000000);
    expect(forceNumber('-$30.65235M')).toBe(-30652350);
    expect(forceNumber('5 million')).toBe(5000000);
  });

  it('should ignore everything after an extra decimal', () => {
    expect(forceNumber('32.43.54')).toBe(32.43);
  });

  it('should convert to NaN if forcing to a number is not possible', () =>{
    expect(forceNumber('whatever')).toBeNaN();
  });

  it('should convert null, undefined, Object, and Array to NaN', () => {
    expect(forceNumber(null)).toBeNaN();
    expect(forceNumber()).toBeNaN();
    expect(forceNumber({})).toBeNaN();
    expect(forceNumber([])).toBeNaN();
    expect(forceNumber([4])).toBeNaN();
  });

  it('should accept a different decimal symbol for number parsing', () => {
    expect(forceNumber('25,12K', {decimalSymbol: ','})).toBe(25120);
    expect(forceNumber('-5,34M', {decimalSymbol: ','})).toBe(-5340000);
  });
});

describe('forceNumber.orNull', () => {
  it('should produce null for values that cannot be coerced into Numbers', () => {
    expect(forceNumber.orNull('asdbs45k')).toBe(45000);

    expect(forceNumber.orNull('whatever')).toBeNull();
    expect(forceNumber.orNull(null)).toBeNull();
    expect(forceNumber.orNull()).toBeNull();
    expect(forceNumber.orNull({})).toBeNull();
    expect(forceNumber.orNull([])).toBeNull();
  });
});
