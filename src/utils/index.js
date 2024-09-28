import { DateTime } from 'luxon'
import map from './map'

const quasarDateFormat = 'yyyy/MM/dd'
const quasarTimeFormat = 'HH:mm'

const dt = {
  parseServerDatetime: function (string) {
    if (!string) return null
    return DateTime.fromISO(string).setZone('Asia/Beirut')
  },

  serializeDatetime: function (datetime) {
    if (!datetime) return ''
    if (!DateTime.isDateTime(datetime)) return ''
    return datetime.toISO()
  },

  short: function (datetime) {
    return datetime.toFormat('d MMM yyyy')
  },

  long: function (datetime) {
    return datetime.toRFC2822()
  },

  time: function (datetime) {
    return datetime.toFormat('HH:mm')
  },

  todayAsQuasarDateString: function () {
    return DateTime.now().toFormat(quasarDateFormat)
  },

  toQuasarDateString: function (datetime) {
    return datetime.toFormat(quasarDateFormat)
  },

  parseQuasarDateString: function (string) {
    return DateTime.fromFormat(string, quasarDateFormat)
  },

  toQuasarTimeString: function (datetime) {
    return datetime.toFormat(quasarTimeFormat)
  },

  parseQuasarTimeString: function (string) {
    return DateTime.fromFormat(string, quasarTimeFormat)
  },

  quasarDateFormat,
  quasarTimeFormat,
}

export { dt, map }
