import assert from 'assert';
import forceNumber from '../src/index.js';

describe('forceNumber', () => {
  it('should force values to numbers using forceNumber()', () => {
    assert.strictEqual(forceNumber(25), 25);
    assert.strictEqual(isNaN(forceNumber(NaN)), true);
  });

  it('should force booleans to 1 or 0', () => {
    assert.strictEqual(forceNumber(true), 1);
    assert.strictEqual(forceNumber(false), 0);
  });

  it('should force different strings to Number', () => {
    assert.strictEqual(forceNumber('USD$ 123.47'), 123.47);
    assert.strictEqual(forceNumber('(100,000¥)'), -100000);
    assert.strictEqual(forceNumber('12/31/2007'), 12312007);
    assert.strictEqual(forceNumber('5 tenths'), 5);
    assert.strictEqual(forceNumber('5 meters'), 5);
  });

  it('should support e notation', () => {
    assert.strictEqual(forceNumber('7e4'), 70000);
  });

  it('should support thousands notation', () => {
    assert.strictEqual(forceNumber('5k'), 5000);
    assert.strictEqual(forceNumber('5K'), 5000);
    assert.strictEqual(forceNumber('5 thousand'), 5000);
  });

  it('should support millions notation', () => {
    assert.strictEqual(forceNumber('5M'), 5000000);
    assert.strictEqual(forceNumber('5m'), 5000000);
    assert.strictEqual(forceNumber('-$30.65235M'), -30652350);
    assert.strictEqual(forceNumber('5 million'), 5000000);
  });

  it('should ignore everything after an extra decimal', () => {
    assert.strictEqual(forceNumber('32.43.54'), 32.43);
  });

  it('should convert to NaN if forcing to a number is not possible', () => {
    assert.strictEqual(isNaN(forceNumber('whatever')), true);
  });

  it('should convert null, undefined, Object, and Array to NaN', () => {
    assert.strictEqual(isNaN(forceNumber(null)), true);
    assert.strictEqual(isNaN(forceNumber()), true);
    assert.strictEqual(isNaN(forceNumber({})), true);
    assert.strictEqual(isNaN(forceNumber([])), true);
    assert.strictEqual(isNaN(forceNumber([4])), true);
  });

  it('should accept a different decimal symbol for number parsing', () => {
    assert.strictEqual(forceNumber('25,12K', {decimalSymbol: ','}), 25120);
    assert.strictEqual(forceNumber('-5,34M', {decimalSymbol: ','}), -5340000);
  });
});

describe('forceNumber.orNull', () => {
  it('should produce null for values that cannot be coerced into Numbers', () => {
    assert.strictEqual(forceNumber.orNull('asdbs45k'), 45000);

    assert.strictEqual(forceNumber.orNull('whatever'), null);
    assert.strictEqual(forceNumber.orNull(null), null);
    assert.strictEqual(forceNumber.orNull(), null);
    assert.strictEqual(forceNumber.orNull({}), null);
    assert.strictEqual(forceNumber.orNull([]), null);
  });
});
