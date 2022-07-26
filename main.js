//main stuff
var express = require('express');
var mysql = require('./dbcon.js'); //where the database info is, inclues the mysql var call
var bodyParser = require('body-parser');
var zmq = require('zeromq');
var sock = zmq.socket("rep");

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

var postCallbackCount;
sock.on('message', function(request) {
  console.log("== received request: [", request.toString(), "]");

  var messageArray = request.toString().split(',');
  var nickname = messageArray[0];
  var time = messageArray[1];
  time = parseFloat(time);
  var runRank = postRun(nickname, time);

})

function postRun(nickname, time) {
  var sql = "INSERT INTO runs (name, rtime) VALUES (?,?);";
  var inserts = [nickname, time];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
    if (error) {
      console.log(error);
    }
    console.log("postRun results: ", results);
    var runRank = getRank(results.insertId);
  })
}

function getRank(runID) {
  var sql = "WITH runRanks AS ( SELECT *, ROW_NUMBER() OVER(ORDER BY rtime) AS ranks FROM runs) SELECT name, rtime, ranks FROM runRanks WHERE run_id = ?;";
  var inserts = [runID];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
    if (error) {
      console.log(error);
    }
    console.log("getRank results: ", JSON.parse(JSON.stringify(results)));
    var workingResults = JSON.parse(JSON.stringify(results));
    var rankresult = parseInt(workingResults[0].ranks);
    console.log("rank:", rankresult);
    var sendMessage = "Your time, (" + workingResults[0].rtime + ") is ranked #" + rankresult + " on the leaderboard";
    sock.send(sendMessage);
  })
}

sock.bind('tcp://*:13376', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("zmq Listening on port 13376");
  }
})

app.listen(app.get('port'), function () {
  console.log("Server listing on port " + app.get('port') + " Press Ctrl+C to terminate.");
});

app.get('/', function(req, res) {
  var callbackCount = 0;
  var context = {};
  //var mysql = req.app.get('mysql')
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
