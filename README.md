# scrollfire

Scrollfire allows you to set functions that will fire when specific DOM elements of your website come into a user's viewport. A typical use case would be an animation that needs to fire when the element comes into view.

## Example

Pass in a jQuery element or regular Element to the addAction method.

```javascript
  var scroller = require('scroller')
  scroller.addAction(Elem, {name: 'myName', myFunction})
```

You can also remove actions later on if for some reason you don't want them to run. Pass in the action name you specified when you added it.

```javascript
  scroller.removeAction('actionName') // i.e. myName
```

