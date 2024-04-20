import { DateTime } from 'luxon'

const dt = {
  parseSimpleDateString: function (string) {
    return DateTime.fromFormat(string, 'yyyyMMdd')
  },

  short: function (datetime) {
    return datetime.toFormat('d MMM')
  },
}

export { dt }
