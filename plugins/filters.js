import Vue from 'vue'
import formatDate from 'date-fns/format'
import * as constants from '~/helpers/constants'

Vue.filter('formatDate',
  (value, format) => {
    if (value) {
      return formatDate(value, format)
    }
  }
)

Vue.filter('capitalize',
  value => {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
)

Vue.filter('firstLetter',
  value => {
    if (value) {
      return value.charAt(0)
    }
  }
)

Vue.filter('truncate',
  (value, length) => {
    if (value) {
      return (value.length > length) ? value.substr(0, length - 1) + '…' : value
    }
  }
)

Vue.filter('removeEmptyArrayItems',
  (value) => {
    var items = value || []
    return items.filter(entry => entry.trim() !== '')
  }
)

Vue.filter('formatProjectBadge',
  value => {
    if (value) {
      let badge = ''
      switch (value) {
        case 'complete':
          badge = 'complete profile'
          break
        case 'metamask':
          badge = 'supports Metamask'
          break
        case 'status-im':
          badge = 'supports Status IM'
          break
        case 'token':
          badge = 'has token'
          break
        default:
          badge = value
      }
      return badge
    }
  }
)

Vue.filter('formatProjectStatus',
  value => {
    if (value) {
      let status = ''
      switch (value) {
        case 'wip':
          status = 'Work in progress'
          break
        default:
          status = value
      }
      return status
    }
  }
)

Vue.filter('formatProjectTabOptions',
  value => {
    var tab = ''
    var options = constants.projectRefineTabOptions || []
    if (options.indexOf(value) !== -1) {
      tab = value.toString().replace('-', ' ')
    } else {
      tab = options[0]
    }
    return tab
  }
)

Vue.filter('uppercase',
  value => {
    if (value) {
      return value.toUpperCase()
    }
  }
)