/** incrementsOfFive - round number to closest increment of five
 * @param {number} num - number to be rounded
 * @return {nubmer} closes increment
 */
export function incrementsOfFive(num) {
  const x = num / 5;
  const y = Math.round(x);
  return y * 5;
}

/** pad - pad a number or string with char
 * @param {strign|number} n - input to be padded
 * @param {number?} width - ammount of charactes the returned string should have
 * @param {string?} char - what to pad with, defalts to "0"
 * @return {string}
 */
export function pad(n, width = 2, char) {
  char = char || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(char) + n;
}

/**
 * sort_unique - sorts and remove duplicate entries
 * copied from: https://stackoverflow.com/questions/4833651/javascript-array-sort-and-unique
 * @param {Array} arr - array to be sorted
 * @return {Array} - sorted array
 */
export function sort_unique(arr) {
  if (arr.length === 0) return arr;
  arr = arr.sort(function(a, b) {
    return a * 1 - b * 1;
  });
  var ret = [arr[0]];
  for (var i = 1; i < arr.length; i++) {
    //Start loop at 1: arr[0] can never be a duplicate
    if (arr[i - 1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }
  return ret;
}
