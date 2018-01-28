# Scrollfire

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

In addition to `name` and `method` you can pass in `persist` if you wish the action to fire for an unlimited number of times.

## To Do

- [ ] Unit Tests