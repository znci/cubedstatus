
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const fs = require('fs');

const pool = mysql.createPool({
    database: process.env['var.database.database'],
    user: process.env['var.database.user'],
    password: process.env['var.database.password'],
    host: process.env['var.database.host'],
    port: process.env['var.database.port'],
    connectionLimit: 100,
    multipleStatements: true
})

pool.on('connection', (res, err) => {
    if (err) {
        console.log('Error while connecting to database');
        console.log(err);
    }
})

app.get('/servers', (req, res) => {
  fetch("https://thingproxy.freeboard.io/fetch/https://api.playerservers.com/servers").then(res => res.json()).then(data => {
    res.json(data)
  })})

//
//  var
//
app.get('/var/api/server', (req, res) => {
  fetch("https://api.playerservers.com/server/var").then(res => res.json()).then(data => {
    res.json(data)
  })
})

app.get('/var/api/user/:uuid', (req, res) => {
  const { uuid } = req.params;
  return new Promise((resolve, error) => {
   pool.query({
    sql: 'SELECT * FROM var_userstats WHERE uuid = ?;',
    values: [uuid]
    }, (err, res) => {
      if (err) return error(err)
      resolve(res[0] ?? null)
    })
  }).then(data => {
    if (!data) {
      res.status(404).send('-1')
      return
    }
    res.status(200).json(data)
  })
})

//
//
//

app.use(express.static(path.join(__dirname + '/public')));
const PORT = 1000 || process.env.PORT;

server.listen(PORT, () => console.log(`API running on port ${PORT}`));
