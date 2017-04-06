/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const app = express();


app.use(express.static('dist'));
app.use(express.static('public'));
app.use(express.static('src/css'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
})


app.listen(process.env.PORT || 3000);
