const timezones = [
  {
    "name": "Baker Island Time",
    "abbreviation": "BIT",
    "offset": "UTC-12:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Samoa Standard Time",
    "abbreviation": "SST",
    "offset": "UTC-11:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Hawaii-Aleutian Standard Time",
    "abbreviation": "HST",
    "offset": "UTC-10:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "HDT",
      "dstOffset": "UTC-09:00"
    }
  },
  {
    "name": "Marquesas Islands Time",
    "abbreviation": "MIT",
    "offset": "UTC-09:30",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Alaska Standard Time",
    "abbreviation": "AKST",
    "offset": "UTC-09:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "AKDT",
      "dstOffset": "UTC-08:00"
    }
  },
  {
    "name": "Pacific Standard Time",
    "abbreviation": "PST",
    "offset": "UTC-08:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "PDT",
      "dstOffset": "UTC-07:00"
    }
  },
  {
    "name": "Mountain Standard Time",
    "abbreviation": "MST",
    "offset": "UTC-07:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "MDT",
      "dstOffset": "UTC-06:00"
    }
  },
  {
    "name": "Central Standard Time",
    "abbreviation": "CST",
    "offset": "UTC-06:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "CDT",
      "dstOffset": "UTC-05:00"
    }
  },
  {
    "name": "Eastern Standard Time",
    "abbreviation": "EST",
    "offset": "UTC-05:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "EDT",
      "dstOffset": "UTC-04:00"
    }
  },
  {
    "name": "Venezuelan Standard Time",
    "abbreviation": "VET",
    "offset": "UTC-04:30",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Atlantic Standard Time",
    "abbreviation": "AST",
    "offset": "UTC-04:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "ADT",
      "dstOffset": "UTC-03:00"
    }
  },
  {
    "name": "Newfoundland Standard Time",
    "abbreviation": "NST",
    "offset": "UTC-03:30",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "NDT",
      "dstOffset": "UTC-02:30"
    }
  },
  {
    "name": "Brazil Time",
    "abbreviation": "BRT",
    "offset": "UTC-03:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "South Georgia and the South Sandwich Islands Time",
    "abbreviation": "GST",
    "offset": "UTC-02:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Azores Time",
    "abbreviation": "AZOT",
    "offset": "UTC-01:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "AZOST",
      "dstOffset": "UTC+00:00"
    }
  },
  {
    "name": "Greenwich Mean Time",
    "abbreviation": "GMT",
    "offset": "UTC+00:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "BST",
      "dstOffset": "UTC+01:00"
    }
  },
  {
    "name": "Central European Time",
    "abbreviation": "CET",
    "offset": "UTC+01:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "CEST",
      "dstOffset": "UTC+02:00"
    }
  },
  {
    "name": "Eastern European Time",
    "abbreviation": "EET",
    "offset": "UTC+02:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "EEST",
      "dstOffset": "UTC+03:00"
    }
  },
  {
    "name": "Moscow Standard Time",
    "abbreviation": "MSK",
    "offset": "UTC+03:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Iran Standard Time",
    "abbreviation": "IRST",
    "offset": "UTC+03:30",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "IRDT",
      "dstOffset": "UTC+04:30"
    }
  },
  {
    "name": "Gulf Standard Time",
    "abbreviation": "GST",
    "offset": "UTC+04:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Afghanistan Time",
    "abbreviation": "AFT",
    "offset": "UTC+04:30",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Pakistan Standard Time",
    "abbreviation": "PKT",
    "offset": "UTC+05:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Indian Standard Time",
    "abbreviation": "IST",
    "offset": "UTC+05:30",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Nepal Time",
    "abbreviation": "NPT",
    "offset": "UTC+05:45",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Bangladesh Standard Time",
    "abbreviation": "BST",
    "offset": "UTC+06:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Myanmar Standard Time",
    "abbreviation": "MMT",
    "offset": "UTC+06:30",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Indochina Time",
    "abbreviation": "ICT",
    "offset": "UTC+07:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "China Standard Time",
    "abbreviation": "CST",
    "offset": "UTC+08:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Australian Central Western Standard Time",
    "abbreviation": "ACWST",
    "offset": "UTC+08:45",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Japan Standard Time",
    "abbreviation": "JST",
    "offset": "UTC+09:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Australian Central Standard Time",
    "abbreviation": "ACST",
    "offset": "UTC+09:30",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "ACDT",
      "dstOffset": "UTC+10:30"
    }
  },
  {
    "name": "Australian Eastern Standard Time",
    "abbreviation": "AEST",
    "offset": "UTC+10:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "AEDT",
      "dstOffset": "UTC+11:00"
    }
  },
  {
    "name": "Lord Howe Daylight Time",
    "abbreviation": "LHDT",
    "offset": "UTC+10:30",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "LHST",
      "dstOffset": "UTC+11:00"
    }
  },
  {
    "name": "Solomon Islands Time",
    "abbreviation": "SBT",
    "offset": "UTC+11:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "New Zealand Standard Time",
    "abbreviation": "NZST",
    "offset": "UTC+12:00",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "NZDT",
      "dstOffset": "UTC+13:00"
    }
  },
  {
    "name": "Chatham Islands Time",
    "abbreviation": "CHAST",
    "offset": "UTC+12:45",
    "daylightSaving": {
      "observesDST": true,
      "dstAbbreviation": "CHADT",
      "dstOffset": "UTC+13:45"
    }
  },
  {
    "name": "Phoenix Islands Time",
    "abbreviation": "PHOT",
    "offset": "UTC+13:00",
    "daylightSaving": {
      "observesDST": false
    }
  },
  {
    "name": "Line Islands Time",
    "abbreviation": "LINT",
    "offset": "UTC+14:00",
    "daylightSaving": {
      "observesDST": false
    }
  }
];