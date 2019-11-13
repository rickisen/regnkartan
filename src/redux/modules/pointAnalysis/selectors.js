import { beginningOfHour } from "../../../helpers";

export const parameters = [
  "t",
  "Tiw",
  "gust",
  "wd",
  "ws",
  "r",
  "prec1h",
  "prec3h",
  "prec12h",
  "prec24h",
  "frsn1h",
  "frsn3h",
  "frsn12h",
  "frsn24h",
  "vis",
  "msl",
  "tcc",
  "lcc",
  "mcc",
  "hcc",
  "c_sigfr",
  "cb_sig",
  "cb_sig",
  "ct_sig",
  "prtype",
  "prsort",
  "spp",
  "Wsymb2",
];

export function getPointAnalysis(state) {
  return {
    humidity: selectParameter(state, "r"),
    precipitation: selectParameter(state, "prec1h"),
    visibility: selectParameter(state, "vis"),
    icon: selectParameter(state, "Wsymb2"),
    cloudCoverage: selectParameter(state, "tcc"),
  };
}

export function selectWindDirection(state) {
  return {
    degrees: selectParameter(state, "wd"),
    speed: selectParameter(state, "ws"),
    gust: selectParameter(state, "gust"),
  };
}

export function selectWeatherSymbol(state) {
  return selectParameter(state, "Wsymb2");
}

export function selectWeatherSymbols({ pointAnalysis: { data } }) {
  let ret = [];

  if (data && data.timeSeries) {
    try {
      ret = data.timeSeries.map(s => ({
        hour: beginningOfHour(new Date(s.validTime)),
        Wsymb2: s.parameters.find(p => p.name === "Wsymb2").values[0],
      }));
    } catch (e) {
      console.warn(
        "Something went wrong when trying to select Wsymb2 entries in data",
        e
      );
    }
  }
  return ret;
}

export function selectTemperature(state) {
  return {
    temperature: selectParameter(state, "t"),
    wetBulb: selectParameter(state, "Tiw"),
  };
}

/** getRelevantHour - returns beggining of hour corresponding to supplied stamp, or if stamp is
 * in the future, its previous hour.
 * @param {number} stamp - stamp in hour to find
 * @return {number} stamp pointing to beggining of relevant hour
 */
function getRelevantHour(stamp) {
  if (beginningOfHour() <= stamp) {
    return beginningOfHour(new Date(Date.now() - 1000 * 60 * 60));
  }
  return beginningOfHour(new Date(stamp));
}

export function selectParameter(
  { timeSelection: { stamp }, pointAnalysis: { data } },
  parameter
) {
  if (!parameters.includes(parameter)) {
    console.warn("parameters must be one of: ", parameters);
  }
  if (stamp && data && data.timeSeries && data.timeSeries.length > 0) {
    const relevantHour = getRelevantHour(stamp);
    const dataForHour = data.timeSeries.find(
      ({ validTime }) => new Date(validTime).getTime() === relevantHour
    );
    if (
      dataForHour &&
      dataForHour.parameters &&
      dataForHour.parameters.length > 0
    ) {
      const point = dataForHour.parameters.find(p => p.name === parameter);
      if (point && point.values && point.values.length > 0) {
        return point.values[0];
      }
    }
  }
}
