var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');


app.use(express.static('./client/build'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var cors = require('cors');
app.use(cors());
var index = require('./routes/Route');


app.use('/', index);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build",     
  "index.html"));
});

//catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// app.set('port', process.env.PORT || 3000);

app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});