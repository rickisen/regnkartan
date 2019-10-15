export function timeIncrementsInRange(increment, { start, end }) {
  const ret = [];
  const applyIncrement = iter => new Date(iter.getTime() + increment);

  for (var i = new Date(start); i.getTime() < end; i = applyIncrement(i)) {
    ret.push(new Date(i.getTime()));
  }

  return ret;
}

export function midpointInRange({ start, end }) {
  const diff = end - start;
  return new Date(start + diff / 2);
}

/**
 * @param {Date} start of the range
 * @param {number} size - how many hours it consists of
 * @return {array} range
 */
export function hourRangeFrom(start = new Date().getTime(), size = 30) {
  const begginingOfThatHour = begginingOfHour(new Date(start));
  const endOfThatHour = begginingOfThatHour + 1000 * 60 * 60;
  const startStamp = endOfThatHour - 1000 * 60 * 60 * (size - 1);
  const range = [];

  for (var hour = 0; hour < size; hour++) {
    range[hour] = startStamp + hour * 1000 * 60 * 60;
  }

  return range;
}

/** @function begginingOfHour
 * @param {Date} date - Date object representing the time we will find an hour for
 * @return {number} timestamp for that dates begining hour
 */
export function begginingOfHour(d = new Date()) {
  const date = new Date(d.getTime());

  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.getTime();
}
