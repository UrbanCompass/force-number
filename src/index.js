const ONE_THOUSAND = Math.pow(10, 3);
const ONE_MILLION = Math.pow(10, 6);
const ONE_BILLION = Math.pow(10, 9);

/**
 * Very aggressively converts value to number, if possible.
 *
 * @param {*} rawInput -- input to convert
 * @param {Object} [options={}]
 * @param {String} [options.decimalSymbol='.']
 * @returns {Number|NaN}
 */
export default function forceNumber(rawInput, {decimalSymbol} = {decimalSymbol: '.'}) {
  switch (typeof rawInput) {
    case 'number':
      return isFinite(rawInput) ? rawInput : NaN;
    case 'boolean':
      return Number(rawInput);
    case 'string':
      const numVal = forceStringToNumber(rawInput, decimalSymbol);

      return isFinite(numVal) ? numVal : NaN;
    default:
      return NaN;
  }
}

/**
 * Convenience function to coerce NaN values to null when using forceNumber()
 *
 * @param {*} input - passed through to forceNumber() as the first argument
 * @param {Object} [options] - passed through to forceNumber() as the second argument
 * @returns {Number|null}
 */
forceNumber.orNull = function forceNumberOrNull(input, options) {
  const numVal = forceNumber(input, options);

  return isNaN(numVal) ? null : numVal;
};

function forceStringToNumber(str, decimalSymbol = '.') {
  let multiplier = 1;

  // 1K = 1000, 2.3 thousand = 2300
  if (/\dK/i.test(str) || /\d\s?thousand/i.test(str)) {
    multiplier = ONE_THOUSAND;
  }
  // 1M = 1000000, 3.2 million = 3200000
  if (/\dM/i.test(str) || /\d\s?million/i.test(str)) {
    multiplier = ONE_MILLION;
  }

  // 1B = 1000000000, 3.2 billion = 3200000000
  if (/\dB/i.test(str) || /\d\s?billion/i.test(str)) {
    multiplier = ONE_BILLION;
  }

  // Some formatters display negative numbers as (123) instead of -123.
  if (/^\(.*\)$/.test(str)) {
    multiplier = multiplier * -1;
  }

  // Preserve 1e6 notation
  const eNotationResult = /\d(e[+-]?\d+)/.exec(str);
  let eNotationSuffix;

  if (eNotationResult) {
    eNotationSuffix = eNotationResult[1];
    str = str.substring(0, str.indexOf(eNotationSuffix));
  } else {
    eNotationSuffix = '';
  }

  // Strip all characters other than digits, minus sign, and the decimal symbol
  str = str.replace(new RegExp('[^0-9-' + decimalSymbol + ']', 'g'), '');
  str = str.replace(decimalSymbol, '.'); // This is the only decimal point parseFloat() understands
  str = str + eNotationSuffix;

  return parseFloat(str) * multiplier;
}
