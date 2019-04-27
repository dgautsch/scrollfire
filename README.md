# Scrollfire
[![Known Vulnerabilities](https://snyk.io/test/github/dgautsch/scrollfire/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dgautsch/scrollfire?targetFile=package.json) [![npm version](https://badge.fury.io/js/scrollfire.svg)](https://badge.fury.io/js/scrollfire) [![CircleCI](https://circleci.com/gh/dgautsch/scrollfire/tree/master.svg?style=svg)](https://circleci.com/gh/dgautsch/scrollfire/tree/master)

Scrollfire allows you to set functions that will fire when specific DOM elements of your website come into a user's viewport. A typical use case would be an animation that needs to fire when the element comes into view.

After writing this, I realized there is a jQuery equivalent with the same name. They accomplish the same thing, but this one doesn't require jQuery.

## Example

First initialize scrollfire

```javascript
  scrollfire.init()
```

Pass in a jQuery element or regular Element to the addAction method.

```javascript
  var scrollfire = require('scrollfire')
  scrollfire.addAction(Elem, {name: 'myName', method: myFunction})
```

You can also remove actions later on if for some reason you don't want them to run. Pass in the action name you specified when you added it.

```javascript
  scrollfire.removeAction('actionName') // i.e. myName
```

### Configuration Options

You can initialize and pass a config option to to the init method. The two parameters that can be changed are `viewportTop` and `viewportBottom`.

```javascript
  var scrollfire = require('scrollfire')
  scrollfire.init({
    viewportTop: 0.1,
    viewportBottom: 1
  })
```
This allows you to widen the viewport window for when the event actions fire. They are percentages of the top and bottom of the viewport. In the example above 0.1 would be the top 10% of the viewport and 1 would be the very bottom. The defaults are 0.3 and 0.6 respectively.

In addition to `name` and `method` you can pass in `persist` if you wish the action to fire for an unlimited number of times.

```javascript
  var scrollfire = require('scrollfire')
  scrollfire.addAction(Elem, {name: 'myName', method: myFunction, persist: true})
```