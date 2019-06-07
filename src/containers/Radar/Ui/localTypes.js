import { PropTypes } from "prop-types";

export const dateCodeRange = PropTypes.arrayOf(PropTypes.string);

export const currentImage = PropTypes.string;

export const svgWidth = PropTypes.number;

export const setCurrentFile = PropTypes.func.isRequired;
export const fetchRecent = PropTypes.func.isRequired;
