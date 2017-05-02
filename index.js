const ONE_THOUSAND = Math.pow(10, 3);
const ONE_MILLION = Math.pow(10, 6);

/**
 * Very aggressively converts value to number, if possible.
 *
 * This is especially useful for reading a numerical value that has been formatted into
 * decorated Strings. As mentioned above, this function is very aggressive -- meaning it will
 * strip all characters other than digits, minus sign, and the decimal symbol and then try to
 * return a number value. Here are some examples:
 *
 *   'USD$ 123.47' ->  123.47
 *   '(100,000¥)'  -> -100000
 *   '-$30.65235M' -> -30652350
 *   '12/31/2007'  ->  12312007
 *   '7e4'         ->  70000
 *   '32.43.54'    ->  32.43 (multiple decimal points are ignored by parseFloat)
 *
 * Also supports the thousand and million multiplier in two formats:
 *
 *   '5k'         -> 5000
 *   '5K'         -> 5000
 *   '5 thousand' -> 5000
 *   '5 tenths'   -> 5
 *   '5M'         -> 5000000
 *   '5m'         -> 5000000
 *   '5 million'  -> 5000000
 *   '5 meters'   -> 5
 *
 * Use with caution.
 *
 * For `Boolean`s: `true` -> 1, `false` -> 0
 * Other input types will return the `failVal`: `null`, `undefined`, `Object`, `Array`.
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
export function forceNumberOrNull(input, options) {
  const numVal = forceNumber(input, options);

  return isNaN(numVal) ? null : numVal;
}

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
