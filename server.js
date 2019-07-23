const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

let users = [];
let online = [];
let messages = [];

app.use(cors());
app.get("/api/messages/", (req, res) => {
  res.send(messages);
});
app.get("/api/online/", (req, res) => {
  res.send(online);
});

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

io.on("connection", socket => {
  const address = socket.handshake.address;
  let go = -1;

  while (go === -1) {
    go = users
      .map(e => {
        return e.id;
      })
      .indexOf(address);

    if (go === -1) {
      createUser(address);
    }
  }

  if (go !== -1) {
    const cur = users[go];

    console.log("User connected: ", cur.name, " @ ", address);
    //io.emit("chat message", cur.name + " connected.");
    messages.push({
      time: getDate(),
      type: "connection",
      content: cur.name + " connected"
    });
    if (online.indexOf(cur.name) === -1) {
      online.push(cur.name);
    }

    io.emit("new message");

    socket.on("disconnect", () => {
      console.log("User disconnected: ", cur.name, " @ ", address);
      //io.emit("chat message", cur.name + " disconnected.");
      messages.push({
        time: getDate(),
        type: "connection",
        content: cur.name + " disconnected"
      });
      online.pop(cur.name);

      io.emit("new message");
    });

    socket.on("chat message", msg => {
      if (msg.length > 0) {
        console.log(cur.name + ": " + msg);
        // io.emit("chat message", cur.name + ": " + msg);
        messages.push({
          time: getDate(),
          type: "message",
          content: cur.name + ": " + msg
        });

        io.emit("new message");
      }
    });

    socket.on("set user", user => {
      if (user.length > 0 && user !== cur.name) {
        let old = cur.name;
        cur.name = user;
        console.log(old + " changed their name to " + cur.name);
        //io.emit("chat message", old + " changed their name to " + cur.name);
        messages.push({
          time: getDate(),
          type: "connection",
          content: old + " changed their name to " + cur.name
        });
        io.emit("new message");
      }
    });
  }
});

function createUser(ip) {
  let user = { id: ip, name: "Anonymous" };
  users.push(user);
  console.log("New user created @ ", ip);
}

const port = 3001;

http.listen(port, () => {
  console.log("listening on port:", port);
});
