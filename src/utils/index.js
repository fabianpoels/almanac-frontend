import { DateTime } from 'luxon'
import map from './map'

const quasarDateFormat = 'yyyy/MM/dd'
const quasarTimeFormat = 'HH:mm'

const dt = {
  parseServerDatetime: function (string) {
    if (!string) return null
    return DateTime.fromISO(string) //.setZone('Asia/Beirut')
  },

  parseSimpleDate: function (string) {
    if (!string) return null
    return DateTime.fromFormat(string, 'yyyyMMdd')
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

  report: function (datetime, locale) {
    return datetime.toLocaleString(
      { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' },
      { locale }
    )
  },

  time: function (datetime) {
    return datetime.toFormat('HH:mm')
  },

  todayAsQuasarDateString: function () {
    return DateTime.now().toFormat(quasarDateFormat)
  },

  todayAsSimpleDateString: function () {
    return DateTime.now().toFormat('yyyyMMdd')
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

  now: function () {
    return DateTime.now()
  },

  quasarDateFormat,
  quasarTimeFormat,
}

export { dt, map }
