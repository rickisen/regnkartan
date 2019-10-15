import React, { memo } from "react";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import { propTypes } from "../../redux/modules/lightning";

/* eslint-disable no-undef */
const icon = require("../../../assets/icons/misc/Lightning.png");
/* eslint-enable no-undef */

function filterCurrent({ year, month, day, hours, minutes }, current) {
  const now = new Date(current);

  return (
    year === now.getUTCFullYear() &&
    month === now.getUTCMonth() + 1 &&
    day === now.getUTCDate() &&
    hours === now.getUTCHours() &&
    (minutes >= now.getUTCMinutes() && minutes < now.getUTCMinutes() + 20)
  );
}

function LightningStrikes({ strikes, stamp }) {
  return (
    <>
      {strikes
        .filter(s => filterCurrent(s, stamp))
        .map(({ nanoseconds, lat, lon }) => (
          <MapView.Marker
            key={"" + nanoseconds + lat + lon}
            coordinate={{ latitude: lat, longitude: lon }}
            anchor={{ x: 0.5, y: 1 }}
            icon={icon}
          />
        ))}
    </>
  );
}

LightningStrikes.propTypes = {
  strikes: propTypes.strikes,
  stamp: PropTypes.number,
};

LightningStrikes.defaultProps = {
  strikes: [],
  stamp: 0,
};

export default memo(LightningStrikes);
