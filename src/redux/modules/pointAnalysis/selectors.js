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
  // forcast params:
  "pmean",
  "tcc_mean",
];

export function getPointAnalysis(state) {
  return {
    humidity: selectParameter(state, "r"),
    precipitation: selectParameter(state, "prec1h"),
    pmean: selectParameter(state, "pmean"),
    visibility: selectParameter(state, "vis"),
    icon: selectParameter(state, "Wsymb2"),
    cloudCoverage: selectParameter(state, "tcc"),
    cloudCoverageMean: selectParameter(state, "tcc_mean"),
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

export function selectWeatherSymbols({
  pointAnalysis: { data, forecastData },
}) {
  let ret = [];

  let timeSeries = [];
  if (data && data.timeSeries) {
    timeSeries = [...data.timeSeries];
  }

  if (forecastData && forecastData.timeSeries) {
    timeSeries = [...timeSeries, ...forecastData.timeSeries];
  }

  if (timeSeries.length > 0) {
    try {
      ret = timeSeries.map(s => ({
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

export function selectParameter(
  { timeSelection: { stamp }, pointAnalysis: { data, forecastData } },
  parameter
) {
  if (!parameters.includes(parameter)) {
    console.warn("parameters must be one of: ", parameters);
    return;
  }

  if (!data && !forecastData) {
    return;
  }

  let timeSeries = [];
  if (data.timeSeries && data.timeSeries.length > 0) {
    timeSeries = [...data.timeSeries];
  }
  if (forecastData.timeSeries && forecastData.timeSeries.length > 0) {
    timeSeries = [...timeSeries, ...forecastData.timeSeries];
  }

  if (timeSeries && timeSeries.length > 0) {
    const relevantHour = beginningOfHour(new Date(stamp));
    const dataForHour = timeSeries.find(
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
