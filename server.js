//requirements
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

//api variables
let users = [];
let online = [];
let messages = [];

//enable cors
app.use(cors());

//api access
app.get("/api/messages/", (req, res) => {
  res.send(messages);
});
app.get("/api/online/", (req, res) => {
  res.send(online);
});

//get date for time stamp
function getDate() {
  const date = new Date(Date.now());
  // Hours part from the timestamp
  let hours = date.getHours();
  let ampm = "am";
  //conver to 12 hour time
  if (hours > 12) {
    hours = hours - 12;
    ampm = "pm";
  }
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
  // Will display time in 10:30:23 format
  let formattedTime = hours + ":" + minutes.substr(-2) + ampm;
  return formattedTime;
}

//when user connects
io.on("connection", socket => {
  //get adress
  const address = socket.handshake.address;
  let go = -1;

  //find adress in users
  while (go === -1) {
    go = users
      .map(e => {
        return e.id;
      })
      .indexOf(address);

    //if can find user make one
    if (go === -1) {
      createUser(address);
    }
  }

  if (go !== -1) {
    //set cur to the user that interacted
    const cur = users[go];

    //figure out if user is already connected
    const idConnected = online
      .map(user => {
        return user.id;
      })
      .indexOf(cur.id);

    //if this is user's first open tab
    if (idConnected === -1) {
      //log in server console
      console.log("User connected: ", cur.name, " @ ", address);
      //push message to messages
      messages.push({
        time: getDate(),
        type: "connection",
        content: cur.name + " connected"
      });
      console.log("message");
      //prompt front end to load messages
      io.emit("new message");
      //add user to the list of online user
      online.push(cur);
      cur.tabs += 1;
    } else {
      console.log("message");
      //prompt front end to load messages
      io.emit("new message");
      //set users tabs to tabs +1
      cur.tabs += 1;
    }

    //when user is typing
    socket.on("typing", () => {
      //log in server console
      console.log(cur.name, " is typing...");
      //push a message
      messages.push({
        time: getDate(),
        type: "connection",
        content: cur.name + " is typing..."
      });
      //emit something telling the front end that a new message was sent and that it should fetch messages again
      io.emit("new message");
    });

    //when user disconnects
    socket.on("disconnect", () => {
      //if this is user's only or last tab and disconnecting will mean they are not on the app on any tab
      if (cur.tabs === 1) {
        //log in server console
        console.log("User disconnected: ", cur.name, " @ ", address);
        //push a message
        messages.push({
          time: getDate(),
          type: "connection",
          content: cur.name + " disconnected"
        });
        //remove the user from online
        online.pop(cur);
        console.log("message");
        //emit something telling the front end that a new message was sent and that it should fetch messages again
        io.emit("new message");
      }
    });

    //when a message is sent
    socket.on("chat message", msg => {
      //only send if message is not blank (spam prevention)
      if (msg.length > 0) {
        //log in server console
        console.log(cur.name + ": " + msg);

        //find index of last typing message from this user (message was sent, user is therefore not typing anymore);
        const lastTyping = messages
          .map(message => {
            return message.content;
          })
          .indexOf(cur.name + " is typing...");
        //remove last instance of (whoever) is typing from the chat log
        messages.splice(lastTyping);

        //push message
        messages.push({
          time: getDate(),
          type: "message",
          user: cur.name,
          content: msg
        });
        console.log("message");
        //prompt front end to fetch new messages
        io.emit("new message");
      }
    });

    //when someone sets their username
    socket.on("set user", user => {
      //only set if name is not same as old and is not blank (spam prevention)
      if (user.length > 0 && user !== cur.name) {
        //variable for previous name
        let old = cur.name;
        //set user's name to recieved name
        cur.name = user;
        //log in console so users know who changed their name to what
        console.log(old + " changed their name to " + cur.name);
        //push to messages
        messages.push({
          time: getDate(),
          type: "connection",
          content: old + " changed their name to " + cur.name
        });

        //set name in online to new name
        online[online.indexOf(old)] = cur.name;

        //prompt frontend that there is a new message
        io.emit("new message", console.log("user changed and message sent"));
      }
    });
  }
});

//create a user for a new ip
function createUser(ip) {
  let user = { tabs: 0, id: ip, name: "Anonymous" };
  //add new user to list of users
  users.push(user);
  //log that new user was created (exclusively in server console)
  console.log("New user created @ ", ip);
}

//set port to 3001 (TODO: set to any available port)
const port = 3001;

//listen on the port provided
http.listen(port, () => {
  console.log("Listening on port:", port);
});
