const API = "https://opendata-download-metanalys.smhi.se";
const FORECAST_API = "https://opendata-download-metfcst.smhi.se";

// Formats and anonymizes lat/lon so smhi doesn't get sent too private
// information, only get loc around ~1km
export function makeUrl(lat, lon, forecast = false) {
  return `${forecast ? FORECAST_API : API}/api/category/${
    forecast ? "pmp3g" : "mesan1g"
  }/version/2/geotype/point/lon/${lon.toFixed(1)}/lat/${lat.toFixed(
    1
  )}/data.json`;
}
