var zmq = require('zeromq');

console.log("Connecting to server...");

var reqsock = zmq.socket('req');

reqsock.on("message", function(reply) {
  console.log("Received reply: [", reply.toString(), "]");

});

//The server for zmq runs off of OSU's flip 2 server, at port 13376. The website however runs on port 13375
reqsock.connect("tcp://flip2.engr.oregonstate.edu:13376");

//The syntax is "<nickname>,<time>" in string format, such as below.
//Below example will input nickname of "Cole" and a time of 53.132524
reqsock.send("Cole,53.132534");
//might be important to note that the sql will only store 5 digits after the decimal.
//which is kind of weird especially considering how computers store floats I'm not sure why they
//set it up like that. This can be changed very easily in the sql create file.

reqsock.on("SIGINT", function() {
  reqsock.close();
})
