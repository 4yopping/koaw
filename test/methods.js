'use strict'

const assert = require('assert')
const waterline = require('./fixtures/waterline')
const Koaw = require('../lib')

describe('controller.methods()', function () {
  before(function *() {
    this.waterline = yield waterline()
  })

  after(function () {
    this.waterline.teardown()
  })

  it('should return an instance to be chained', function () {
    let controller = new Koaw({
      orm: this.waterline,
      model: 'store'
    })

    assert.equal(controller, controller.methods('get post'))
  })

  it('should set default methods', function () {
    let methods = ['get', 'post', 'put', 'delete']
    let controller = new Koaw({
      orm: this.waterline,
      model: 'store'
    })
    let allowed = controller.allowedMethods

    assert(Array.isArray(allowed))
    assert.equal(allowed.length, methods.length)
    assert(allowed.every(m => !!~methods.indexOf(m)))
  })

  it('should set specific methods with a whitelisted string', function () {
    let methods = ['get', 'post']
    let controller = new Koaw({
      orm: this.waterline,
      model: 'store'
    })
    controller.methods(methods.join(' '))

    let allowed = controller.allowedMethods

    assert(Array.isArray(allowed))
    assert.equal(allowed.length, methods.length)
    assert(allowed.every(m => !!~methods.indexOf(m)))
  })

  it('should set specific methods with an array', function () {
    let methods = ['put', 'delete']

    let controller = new Koaw({
      orm: this.waterline,
      model: 'store'
    })
    controller.methods(methods)

    let allowed = controller.allowedMethods

    assert(Array.isArray(allowed))
    assert.equal(allowed.length, methods.length)
    assert(allowed.every(m => !!~methods.indexOf(m)))
  })

  it('should not set specific methods with an invalid argument', function (done) {
    let controller = new Koaw({
      orm: this.waterline,
      model: 'store'
    })

    try {
      controller.methods(function () {})
      done(controller)
    } catch (e) {
      assert.equal(e.message, 'HTTP methods should be specified with an array or whitelisted string')
      done()
    }
  })

  it('should not set invalid methods', function (done) {
    let controller = new Koaw({
      orm: this.waterline,
      model: 'store'
    })
    let strMethods = 'foo bar baz meh'

    try {
      controller.methods(strMethods)
      done('Should throw an error')
    } catch (e) {
      let methods = ['get', 'post', 'put', 'delete']
      let allowed = controller.allowedMethods

      assert(Array.isArray(allowed))
      assert.equal(allowed.length, methods.length)
      assert(allowed.every(m => !!~methods.indexOf(m)))

      done()
    }
  })
})
