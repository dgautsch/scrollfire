var Scroller = (function () {
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

  var actionQueue = []

  /**
   * scrollActionAdd - Creates a custom event to add a ScrollAction
   *
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
   * @param {object} element - A DOM element or jQuery element object
   * @param {object} action - action - An object with the action parameters
   * @param {string} action.name - The name of the action
   * @param {callback} action.method - The method to fire
   */
  function ScrollAction (element, action) {
    if (!typeof jQuery === 'undefined' && element instanceof jQuery) {
      this.element = element[0]
    }
    if (element instanceof NodeList) {
      this.element = element
    }
    this.actionName = action.name
    this.actionMethod = action.method
    this.hasFired = false
  }

  /**
   * addAction -Adds an action to the action queue
   *
   * @param {Object} elem - A DOM element or jQuery element object
   * @param {Object} action - An object with the action parameters
   * @param {string} action.name - The name of the action
   * @param {callback} action.method - The method to fire
   */
  function addAction (elem, action) {
    var taskAction = new ScrollAction(elem, action)
    document.dispatchEvent(scrollActionAdd(taskAction))
  }

  /**
   * removeAction - Removes an action from the action queue
   *
   * @param {string} actionMethodName - The name of the action to remove
   */
  function removeAction (actionName) {
    document.dispatchEvent(scrollActionRemove(actionName))
  }

  function actionController () {
    document.addEventListener('scrollActionAdd', function (e) {
      var data = e.detail
      actionQueue.push(data)
    })

    document.addEventListener('scrollActionRemove', function (e) {
      var data = e.detail
      actionQueue.find(function (elem, idx, arr) {
        if (elem.actionName === data) {
          arr.splice(idx, 1)
        }
      })
    })
  }

  /**
   * scrollWatch - Watches for scroll events and checks the y position
   *
   */
  function scrollWatch () {
    var viewportWatch = debounce(function () {
      var viewportTop = window.innerHeight * 0.3
      var viewportBottom = window.innerHeight * 0.6
      actionQueue.find(function (elem) {
        if (elem.element) {
          var elemTop = elem.element.getBoundingClientRect().top
          if (elemTop >= viewportTop && elemTop <= viewportBottom && !elem.hasFired) {
            elem.hasFired = true // only fire the animation once
            elem.actionMethod()
          }
        }
      })
    }, 10, true)
    window.addEventListener('scroll', viewportWatch)
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
      var context = this;
      var args = arguments;
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
   * init - initializes the scroller module
   *
   */
  function init () {
    actionController()
    scrollWatch()
  }

  return {
    addAction: addAction,
    removeAction: removeAction,
    init: init
  }
})()

module.exports = Scroller
