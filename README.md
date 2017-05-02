# force-number
Very aggressively converts value to number, if possible.

This is especially useful for reading a numerical value that has been formatted into
decorated Strings. As mentioned above, this function is very aggressive -- meaning it will
strip all characters other than digits, minus sign, and the decimal symbol and then try to
return a number value. Here are some examples:

```
'USD$ 123.47' ->  123.47
'(100,000¥)'  -> -100000
'-$30.65235M' -> -30652350
'12/31/2007'  ->  12312007
'7e4'         ->  70000
'32.43.54'    ->  32.43 (multiple decimal points are ignored)
```

Also supports the thousand and million multiplier in two formats:

```
'5k'         -> 5000
'5K'         -> 5000
'5 thousand' -> 5000
'5 tenths'   -> 5
'5M'         -> 5000000
'5m'         -> 5000000
'5 million'  -> 5000000
'5 meters'   -> 5
```

Use with caution.

For `Boolean`s: `true` -> 1, `false` -> 0

Other input types will return the `failVal`: `null`, `undefined`, `Object`, `Array`.


## Installation

Via npm:
```
npm install --save force-number
```

## Usage
```js
import forceNumber from 'force-number';

forceNumber('USD$ 123.47'); // 123.47
forceNumber('whatever'); // NaN
```

Also included is a convenience function that will automatically convert a `NaN` result to `null`:
```js
import {forceNumberOrNull} from 'force-number';

forceNumberOrNull('whatever'); // null
```

Note that this is written entirely in ES2015+. If you need to use this in a runtime that does not
support ES2015 features, you will need to provide your own transpilation process in order to use
this library.
