function pad(n, width = 2, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function generateDateCode(date) {
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
        pad(date.getDate())}`
  } catch (e) {
    console.error("Error occured when trying to generate dateCode", e);
  }

  return dateCode
}
