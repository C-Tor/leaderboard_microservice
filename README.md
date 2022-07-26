# leaderboard_microservice
Serves 2 purposes
1. A website that keeps track of global top scores, which can be posted to by sending a zeroMQ message
2. A rank retrieval service, that when a run is submitted to the leaderboard, a message is sent giving the leaderboard position for that run

## Communication Contract
### Prerequisites
- ZeroMQ is required for messageing. Set up ZeroMQ for whatever language used.
- In it's current state, it runs off of OSU's mysql database, so the website itself needs to be run off of the school's service, which means you must be connected to OSU's VPN.

### Requesting/Sending
This service uses request/reply methods for communication, so for your service you will use request as it's the client. Create a req socket. Then, connect that socket to: "tcp://flip2.engr.oregonstate.edu:13376", which is the site and port the service is currently running on. Hopefully that port won't be taken in the meantime.

To send your score for processing, simply send the score (socket.send() in nodejs) in the format of "nickname,<score>". Nickname is processed into a string and score is processed into a float. There is no error handling or exceptions implemented on this so if not done correctly the results could be a bit weird.

### Receiving
The reply is in the form of a ZeroMQ message. The message will be received as a reply on the same socket used to send the initial message. Create a receive function to receive the reply, looks like reqsock.on("message", function(reply) {}); on nodejs.

The sending of your score is itself a request. So shortly after the score is sent, a message containing along the lines of  "Your time, (<time>) is ranked #<rank> on the leaderboard".

There is an example in the repository (clientExample.js) of what the general interactions should look like. 

### UML Diagram
![UML Diagram](https://github.com/C-Tor/leaderboard_microservice/blob/main/UML%20class.png?raw=true)
