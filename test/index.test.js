/* eslint-env jest */
const Scrollfire = require('../index')

describe('Scrollfire', () => {
  it('initializes with a config', () => {
    const config = {
      viewportTop: 0.1,
      viewportBottom: 1
    }
    const spy = jest.spyOn(Scrollfire, 'init')
    Scrollfire.init(config)
    expect(spy).toHaveBeenCalledWith(config)
  })

  it('adds an action', () => {
    const elem = document.createElement('div')
    elem.id = 'test'
    Scrollfire.addAction(elem, {
      name: 'testAction',
      method: () => {}
    })
    expect(Scrollfire.actionStore.length).toBe(1)
    Scrollfire.removeAction('testAction')
  })

  it('removes an action', () => {
    const elem = document.createElement('div')
    elem.id = 'test'
    Scrollfire.addAction(elem, {
      name: 'testAction',
      method: () => {}
    })
    Scrollfire.removeAction('testAction')
    expect(Scrollfire.actionStore.length).toBe(0)
  })
})
