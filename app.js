var express = require('express')
var app = express()
app.listen(80)

var getSheets = require('./js/sheets.js').get


app.get('/hospitais', require('./js/hospitais.js'));
app.get('/pedidos', require('./js/pedidos.js'));
app.use('/',express.static('private_html'))

// npm install pm2 --global
// pm2 start app.js --watch
// pm2 startup
// pm2 save