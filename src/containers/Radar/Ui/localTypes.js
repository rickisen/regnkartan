import { PropTypes } from "prop-types";

export const selectedRange = PropTypes.shape({
  start: PropTypes.date,
  end: PropTypes.date,
  dateCodeRange: PropTypes.arrayOf(PropTypes.string),
});

export const chunks = PropTypes.arrayOf(
  PropTypes.shape({
    time: PropTypes.date,
    status: PropTypes.string,
  })
);

export const dateCodeRange = PropTypes.arrayOf(PropTypes.string);

export const currentImage = PropTypes.string;

export const svgWidth = PropTypes.number;

export const setCurrentFile = PropTypes.func.isRequired;