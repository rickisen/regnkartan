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
 * @param {number} ammountOfBackwards - How much of the genereated hours should distribute backwards from start time
 * @return {array} range
 */
export function hourRangeFrom(
  start = Date.now(),
  size = 72,
  ammountOfBackwards = 0.4
) {
  const begginingOfThatHour = beginningOfHour(new Date(start));
  const endOfThatHour = begginingOfThatHour + 1000 * 60 * 60;
  const startStamp =
    endOfThatHour - 1000 * 60 * 60 * Math.round(size * ammountOfBackwards - 1);
  const range = [];

  for (var hour = 0; hour < size; hour++) {
    range[hour] = startStamp + hour * 1000 * 60 * 60;
  }

  return range;
}

/**
 * @param {Date||Number} date - Date/stamp representing the time we will find an hour for
 * @return {number} timestamp for that dates begining hour
 */
export function beginningOfDay(d = new Date()) {
  const date = new Date(beginningOfHour(d));

  date.setUTCHours(0);

  return date.getTime();
}

/** @function beginningOfHour
 * @param {Date||Number} date - Date/stamp representing the time we will find an hour for
 * @return {number} timestamp for that dates begining hour
 */
export function beginningOfHour(d = new Date()) {
  const date = new Date(d);

  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.getTime();
}
