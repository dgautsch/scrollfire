/**
 * Scrollfire
 * @module Scrollfire
 *
 */
var Scrollfire = (function () {
  /**
   * Polyfill for CustomEvent on IE9+
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
   */
  (function () {
    if (typeof window.CustomEvent === 'function') return false

    function CustomEvent (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined }
      var evt = document.createEvent('CustomEvent')
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
      return evt
    }

    CustomEvent.prototype = window.Event.prototype

    window.CustomEvent = CustomEvent
  })()

  /**
   * An array of actions created
   *
   */
  var actionStore = []
  var initialized = false

  /**
   * scrollActionAdd - Creates a custom event to add a ScrollAction
   *
   * @param {Object} scrollAction - The scroll action object
   * @returns {event} scrollActionAdd event
   */
  function scrollActionAdd (scrollAction) {
    return new CustomEvent('scrollActionAdd', {
      detail: scrollAction
    })
  }

  /**
   * scrollActionRemove - Creates a custom event to remove a ScrollAction
   *
   * @param {string} actionName - The action name to remove
   * @returns {event} scrollActionRemove event
   */
  function scrollActionRemove (actionName) {
    return new CustomEvent('scrollActionRemove', {
      detail: actionName
    })
  }

  /**
   * ScrollAction - Creates a new ScrollAction
   *
   * @type constructor
   *
   * @param {Object} element - A DOM element or jQuery element object
   * @param {Object} config - config - An object with the config parameters
   * @param {string} config.name - The name of the config
   * @param {callback} config.method - The method to fire
   */
  function ScrollAction (element, config) {
    if (!config.name) {
      throw new Error('You must specify a config.name.')
    }
    if (!config.method) {
      throw new Error('You must specify a config.method to fire.')
    }
    if (!typeof jQuery === 'undefined' && element instanceof jQuery) {
      this.element = element[0]
    } else if (element instanceof NodeList) {
      this.element = element
    } else {
      this.element = element
    }
    this.actionName = config.name
    this.actionMethod = config.method || function () {}
    this.persist = config.persist || false
    this.hasFired = false
  }

  /**
   * addAction -Adds an action to the action queue
   *
   * @param {Object} elem - A DOM element or jQuery element object
   * @param {Object} config - An object with the action parameters
   * @param {string} config.name - The name of the action
   * @param {function} config.method - The method to fire
   * @param {boolean} config.persist - True to fire action endlessly
   */
  function addAction (elem, config) {
    if (!initialized) throw new Error('Scrollfire has not been initialized, you must call scrollfire.init()')
    var taskAction = new ScrollAction(elem, config)
    document.dispatchEvent(scrollActionAdd(taskAction))
  }

  /**
   * removeAction - Removes an action from the action queue
   *
   * @param {string} actionName - The name of the action to remove
   */
  function removeAction (actionName) {
    if (!initialized) throw new Error('Scrollfire has not been initialized, you must call scrollfire.init()')
    document.dispatchEvent(scrollActionRemove(actionName))
  }

  /**
   * scrollWatch - Watches for scroll events and checks the y position
   *
   */
  function bootstrap (config) {
    document.addEventListener('scrollActionAdd', function (e) {
      var data = e.detail
      actionStore.push(data)
    })

    document.addEventListener('scrollActionRemove', function (e) {
      var data = e.detail
      actionStore.forEach(function (elem, idx, arr) {
        if (!elem || !elem.hasOwnProperty('actionName')) return
        debugger;
        if (elem.actionName === data) {
          arr.splice(idx, 1)
        }
      })
    })

    window.addEventListener('scroll', debounce(function () {
      const viewportTop = window.innerHeight * config.viewportTop
      const viewportBottom = window.innerHeight * config.viewportBottom

      actionStore.find(function (elem) {
        if (elem.element) {
          const elemTop = elem.element.getBoundingClientRect().top
          if (elemTop >= viewportTop && elemTop <= viewportBottom && !elem.hasFired) {
            if (!elem.persist) {
              elem.hasFired = true // only fire the animation once
            }
            elem.actionMethod()
          }
        }
      })
    }, 10, true))
  }

  /**
   * debounce - Returns a function, that, as long as it continues to be invoked, will not
   * be triggered.
   *
   * as seen in underscore.js
   *
   * @param  {function} func - function will be called after it stops being called for N milliseconds
   * @param  {number} wait - Duration in N milliseconds
   * @param  {boolean} immediate - If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
   * @return {function}
   */
  function debounce (func, wait, immediate) {
    var timeout
    return function () {
      var context = this
      var args = arguments
      var later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }

  /**
   * init - initializes the Scrollfire module
   *
   */
  function init (config) {
    const defaults = Object.assign({}, {
      viewportTop: 0.3,
      viewportBottom: 0.6
    }, config)

    if (!initialized) {
      initialized = true
    } else {
      console.warn('Scrollfire has already been initialized')
      return
    }
    bootstrap(defaults)
  }

  return {
    actionStore: actionStore,
    addAction: addAction,
    removeAction: removeAction,
    init: init
  }
})()

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Scrollfire
} else {
  window.Scrollfire = Scrollfire
}
