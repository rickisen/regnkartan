# SMHI Point Analysis

Data and parameter meaning

| Parameter  | Unit   | Description                          | Value          | range       |
| ---------- | ------ | ------------------------------------ | -------------- | ----------- |
| "t",       | C      | Air temperature                      | Decimal number | one decimal |
| "Tiw",     | C      | Wet bulb temperature                 | Decimal number | one decimal |
| "gust",    | m/s    | Wind gust speed                      | Decimal number | one decimal |
| "wd",      | degree | Wind direction                       | Integer        |             |
| "ws",      | m/s    | Wind speed                           | Decimal number | one decimal |
| "r",       | %      | Relative humidity                    | Integer        | 0-100       |
| "prec1h",  | mm     | Precipitation last hour              | Decimal number | one decimal |
| "prec3h",  | mm     | Precipitation last three hours       | Decimal number | one decimal |
| "prec12h", | mm     | Precipitation last 12 hours          | Decimal number | one decimal |
| "prec24h", | mm     | Precipitation last 24 hours          | Decimal number | one decimal |
| "frsn1h",  | cm     | Snow precipitation last hour         | Decimal number | one decimal |
| "frsn3h",  | cm     | Snow precipitation last three hours  | Decimal number | one decimal |
| "frsn12h", | cm     | Snow precipitation last 12 hours     | Decimal number | one decimal |
| "frsn24h", | cm     | Snow precipitation last 24 hours     | Decimal number | one decimal |
| "vis",     | km     | Horizontal visibility                | Decimal number | one decimal |
| "msl",     | hPa    | Pressure reduced to medium sea level | Integer        |             |
| "tcc",     | octas  | Total cloud cover                    | Integer        | 0-8         |
| "lcc",     | octas  | Low level cloud cover                | Integer        | 0-8         |
| "mcc",     | octas  | Medium level cloud cover             | Integer        | 0-8         |
| "hcc",     | octas  | High level cloud cover               | Integer        | 0-8         |
| "c_sigfr", | %      | Fraction of significant clouds       | Integer        | 0-100       |
| "cb_sig",  | m      | Cloud base of significant clouds     | Integer        |             |
| "cb_sig",  | m      | Cloud base of significant clouds     | Integer        |             |
| "ct_sig",  | m      | Cloud top of significant clouds      | Integer        |             |
| "prtype",  | code   | Type of precipitation                | Integer        | 0-6         |
| "prsort",  | code   | Sort of precipitation                | Integer        | -9 or 1     |
| "spp",     | %      | Frozen part of total precipitation.  | Integer        | -9 or 0-100 |
| "Wsymb2",  | code   | Weather Symbol                       | Integer        | 1-27        |

## Wsymb2

| Value | Meaning                |
| ----- | ---------------------- |
| 1     | Clear sky              |
| 2     | Nearly clear sky       |
| 3     | Variable cloudiness    |
| 4     | Halfclear sky          |
| 5     | Cloudy sky             |
| 6     | Overcast               |
| 7     | Fog                    |
| 8     | Light rain showers     |
| 9     | Moderate rain showers  |
| 10    | Heavy rain showers     |
| 11    | Thunderstorm           |
| 12    | Light sleet showers    |
| 13    | Moderate sleet showers |
| 14    | Heavy sleet showers    |
| 15    | Light snow showers     |
| 16    | Moderate snow showers  |
| 17    | Heavy snow showers     |
| 18    | Light rain             |
| 19    | Moderate rain          |
| 20    | Heavy rain             |
| 21    | Thunder                |
| 22    | Light sleet            |
| 23    | Moderate sleet         |
| 24    | Heavy sleet            |
| 25    | Light snowfall         |
| 26    | Moderate snowfall      |
| 27    | Heavy snowfall         |

## prsort

| Value | Meaning          |
| ----- | ---------------- |
| 0     | No precipitation |
| 1     | Snow             |
| 2     | Snow and rain    |
| 3     | Rain             |
| 4     | Drizzle          |
| 5     | Freezing rain    |
| 6     | Freezing drizzle |
