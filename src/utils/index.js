import { DateTime } from 'luxon'

const simpleDateFormat = 'yyyyMMdd'
const quasarDateFormat = 'yyyy/MM/dd'

const dt = {
  parseSimpleDateString: function (string) {
    if (!string) return null
    return DateTime.fromFormat(string, simpleDateFormat)
  },

  todayAsSimpleString: function () {
    return DateTime.now().toFormat(simpleDateFormat)
  },

  short: function (datetime) {
    return datetime.toFormat('d MMM')
  },

  toQuasarDateString: function (datetime) {
    return datetime.toFormat(quasarDateFormat)
  },

  parseQuasarDateString: function (string) {
    return DateTime.fromFormat(string, quasarDateFormat)
  },
  simpleDateFormat,
  quasarDateFormat,
}

export { dt }
