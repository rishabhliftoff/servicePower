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

app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})


app.listen(process.env.PORT || 3000);
