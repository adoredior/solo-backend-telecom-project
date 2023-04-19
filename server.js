const express = require('express');
const app = express();
const port = 5500;
const bodyParser = require('body-parser'); 
const router = require('./customer');
const cors = require('cors')

app.use(bodyParser.json());

app.use(require('./customer'))
app.use(require('./bills'))


const pgp = require('pg-promise')();
//const db =pgp('postgres://kb:@127.0.0.1:5432/postgres');
app.use(cors());


/*app.get('/', (req, res) => {
    res.send('Hello, world!')
  })*/
  

app.listen(5500, () => {
    console.log(`Server listening on port 5500`);
});