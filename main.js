//main stuff
var express = require('express');
var mysql = require('./dbcon.js'); //where the database info is, inclues the mysql var call
var bodyParser = require('body-parser');

// var teams = require('./teams.js');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

app.engine('handlebars', handlebars.engine);
// app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');
//app.set('mysql', mysql);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


//sets port to the argument given after calling the command to start the server (ie node main.js <port>)
app.set('port', process.argv[2]);



app.listen(app.get('port'), function () {
  console.log("Server listing on port " + app.get('port') + " Press Ctrl+C to terminate.");
});

app.get('/', function(req, res) {
  var callbackCount = 0;
  var context = {};
  //var mysql = req.app.get('mysql')
  console.log("app.get '/' called");
  getRuns(res, context, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 1) {
      res.render('runs', context);
    }
  }
});


function getRuns(res, context, complete) {
  console.log(" -- getting runs");
  mysql.pool.query("SELECT name, rtime, ROW_NUMBER() OVER(ORDER BY rtime) rrank FROM runs", function (error, results, fields){
    if(error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.runs = results;
    complete();
  })
}

function getRun(res, mysql, context, id) {

}
