export function pad(n, width = 2, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function generateDateCode(date, hour = false, minute = false) {
  let dateCode = ''

  if (typeof date !== 'object') {
    console.error("date not real date", date);
    return dateCode
  }

  try {
    dateCode = `${
        date.getFullYear() - 2000
      }${
        pad(date.getMonth() + 1)
      }${
        pad(date.getDate())
      }${
        hour? pad(date.getHours()) : ''
      }${
        minute? pad(date.getMinutes()) : ''
    }`
  } catch (e) {
    console.error("Error occured when trying to generate dateCode", e);
    return ''
  }

  return dateCode
}

// https://stackoverflow.com/questions/4833651/javascript-array-sort-and-unique
export function sort_unique(arr) {
  if (arr.length === 0) return arr;
  arr = arr.sort(function (a, b) { return a*1 - b*1; });
  var ret = [arr[0]];
  for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
    if (arr[i-1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }
  return ret;
}
