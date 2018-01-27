# scrollfire

Scrollfire allows you to set functions that will fire when specific DOM elements of your website come into a user's viewport. A typical use case would be an animation that needs to fire when the element comes into view.

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
