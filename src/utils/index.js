import { DateTime } from 'luxon'

const quasarDateFormat = 'yyyy/MM/dd'

const dt = {
  parseServerDatetime: function (string) {
    if (!string) return null
    return DateTime.fromISO(string).setZone('Asia/Beirut')
  },

  todayAsSimpleString: function () {
    return DateTime.now().toFormat(simpleDateFormat)
  },

  short: function (datetime) {
    return datetime.toFormat('d MMM')
  },

  long: function (datetime) {
    return datetime.toRFC2822()
  },

  toQuasarDateString: function (datetime) {
    return datetime.toFormat(quasarDateFormat)
  },

  parseQuasarDateString: function (string) {
    return DateTime.fromFormat(string, quasarDateFormat)
  },
  quasarDateFormat,
}

export { dt }
