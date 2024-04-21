import { Notify } from 'quasar'

const alert = {
  success: function (message) {
    Notify.create({
      message,
      color: 'positive',
      position: 'top',
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
        },
      ],
    })
  },

  error: function (message) {
    Notify.create({
      message,
      color: 'negative',
      position: 'top',
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
        },
      ],
    })
  },
}

export { alert }
