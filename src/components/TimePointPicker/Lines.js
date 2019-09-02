import React, {memo} from 'react';
import {Line} from 'react-native-svg';

function RulerLines({hourWidth, isStartOfDay}) {
  const everyTenth = hourWidth / 4;
  const everyHalf = hourWidth / 2;
  const minutes = Array.from(Array(hourWidth), (v, i) => i);

  // Have to pad with +1px because the first line will be half cropped from
  // beeing half outside the svg. Apparently lines anchor point is in its
  // center
  return (
    <>
      {minutes.map(minute =>
        minute % everyTenth === 0 || minute % everyHalf === 0 ? (
          <Line
            key={minute}
            x1={minute + 1}
            y2="0"
            x2={minute + 1}
            y1={
              minute % everyHalf === 0 ? (minute === everyHalf ? 20 : 15) : 10
            }
            stroke={minute === everyHalf && isStartOfDay ? 'black' : '#999'}
            strokeWidth="1"
          />
        ) : null,
      )}
    </>
  );
}

export default memo(RulerLines);
