var express = require('express')
var auth = require('http-auth')

var app = express()
var config = require('nconf').env().file({
    file: 'config.json'
})
var basicAuth = auth.basic({
  realm: 'Secam.'
}, function (username, password, callback) {
  var usernameMatch = config.get('SECAM_USERNAME') === username
  var passwordMatch = config.get('SECAM_PASSWORD') === password
  callback(usernameMatch && passwordMatch)
})

var on = false

app.get('/on', auth.connect(basicAuth), function (req, res) {
  on = true
  res.status(200).send('ON')
})

app.get('/off', auth.connect(basicAuth), function (req, res) {
  on = false
  res.status(200).send('OFF')
})

app.get('/status', function (req, res) {
  res.sendStatus(on ? 200 : 204)
})

app.listen(config.get('SECAM_PORT') || 4040)
