//import react, styled components, components, socket and declare variable (msgsEnd) which will allow bottom scrolling but does not require state
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Settings from "./Settings";
import openSocket from "socket.io-client";
let socket = openSocket("http://kan5048:3001");
let msgsEnd;

//varible for if typing emit has been sent to avoid lag
let typing = false;

//parent style for buttons
const Submit = styled.button`
  border-radius: 8px;
  background: ${props => props.colour};
  color: white;
  border: none;

  padding: 1em;

  :focus {
    outline: none;
  }
`;

//button for submitting user name
const UserSubmit = styled(Submit)`
  width: 20%;
  height: 3em;
  margin-top: 1em;
`;
//button for submitting a message
const MsgSubmit = styled(Submit)`
  width: 6%;
`;

//parent style for inputs
const Box = styled.input`
  border: 0;
  background: #2c2f33;
  color: white;
  border-radius: 8px;
  padding: 1em;
  :focus {
    outline: none;
  }
`;

//input box for typing user name
const UserBox = styled(Box)`
  width: 70%;
  margin: 1em;
`;

//input box for typing messages
const MsgBox = styled(Box)`
  width: 90%;
  margin-right: 0.5%;
`;

//Titlebar styling
const TitleBar = styled.div`
  background: #23272a;
  padding: 1em;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  color: white;
  font-size: 2em;
`;

//prompt styling (such as "Nickname" prompt before username set input bar)
const Prompt = styled.div`
  color: white;

  margin: 1em;
  margin-top: 1.5em;
`;

//parent styling for containers
const Container = styled.form`
  background: #23272a;
  padding: 1em;
  position: fixed;
  display: flex;
`;
//container for message sending portion of screen
const MsgContainer = styled(Container)`
  bottom: 0;
  width: 100%;
  color: white;
`;
//container for user name setting portion of screen
const UserContainer = styled(Container)`
  top: 0;
  right: 0;
  width: 20%;
  border-radius: 8px;
`;

//styling for message bubbles
const Msg = styled.div`
  margin-top: 0.25em;
  margin-left: 7em;
  border-radius: 8px;
  padding: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  background: ${props => props.colour};
  width: fit-content;
  color: white;
  max-width: 60%;
`;

//parent element for grey text alerts
const GreyText = styled.div`
  padding-top: 1em;
  margin: 0.5em;
  padding-bottom: 0.25em;
  display: inline-block;
  width: fit-content;
  color: grey;
`;

//styling for connection and name change alerts
const Alert = styled(GreyText)`
  && {
    padding-bottom: 1em;
  }
`;
//timestamp styling
const Timestamp = styled(GreyText)`
  padding: 1em;
  padding-bottom: 0.25em;
`;

//container for chat portion of screen
const ChatBox = styled.div`
  background: #2c2f33;
  margin-top: 8em;
  margin-bottom: 6em;
  padding: 0;
  box-sizing: border-box;
`;

//app component
function App() {
  //STATE VARIABLES
  //value of content in message input
  const [msgvalue, setmsgValue] = useState("");
  //value of content in user name input
  const [uservalue, setuserValue] = useState("");
  //list of all messages
  const [messages, setMessages] = useState([]);
  //selected colour
  const [colour, setColour] = useState("#7289da");
  //list of online users
  const [online, setOnline] = useState([]);

  //function to fetch online users
  async function fetchOnline() {
    const res = await fetch("http://kan5048:3001/api/online/");

    const results = await res.json();
    setOnline(results);
  }

  //function to set username
  function setUsername(event) {
    //prevent reload
    event.preventDefault();

    if (uservalue.length > 0) {
      //emit to backend that user was set and send new user
      socket.emit("set user", uservalue);
    }
  }

  //function to send a message
  function sendMessage(event) {
    //prevent reload
    event.preventDefault();
    if (msgvalue.length > 0) {
      //emit to backend that a message was sent and send the message
      socket.emit("chat message", msgvalue);
      //set typing to false
      typing = false;
      //set the value of the input box for messages to blank (spam prevention)
      setmsgValue("");
    }
  }

  //set value msgValue state to what is in input bar
  function updatemsgValue(event) {
    //if typing prompt not sent
    if (!typing) {
      //emit to backend that user is typing
      socket.emit("typing");
      //set typing to true
      typing = true;
    }

    setmsgValue(event.target.value);
  }
  //set value userValue state to what is in input bar
  function updateuserValue(event) {
    setuserValue(event.target.value);
  }

  //function to fetch message list from backend api every time a new message is sent
  //TODO: make more efficient so only grabs latest message from api (must add message ids?)
  async function fetchMessages() {
    const res = await fetch("http://kan5048:3001/api/messages/");

    const results = await res.json();

    setMessages(results);
  }

  //scroll to bottom of page so see latest messages
  function scrollToBottom() {
    msgsEnd.scrollIntoView({ behavior: "smooth" });
  }

  //scroll to bottom each update
  useEffect(() => {
    scrollToBottom();
    //remove listener
    return () => socket.off("new message", console.log(""));
  });

  //when backend prompts that a new message was sent, fetch users and online data
  socket.on("new message", () => {
    fetchOnline();
    fetchMessages();
  });

  //change colour for styled components when user clicks button to change
  function changeColour(c) {
    setColour(c);
  }

  return (
    <>
      <TitleBar>(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</TitleBar>
      <UserContainer onSubmit={setUsername}>
        <Prompt>Nickname</Prompt>
        <UserBox
          id="u"
          autoComplete="off"
          value={uservalue}
          onChange={updateuserValue}
        />
        <UserSubmit colour={colour}>SET</UserSubmit>
      </UserContainer>
      <Settings changeColour={changeColour} online={online} />
      <ChatBox>
        {messages.length !== 0
          ? messages.map((message, i) =>
              message.type === "message" ? (
                <div key={i}>
                  <Timestamp>{message.time}</Timestamp>
                  <GreyText>{message.user}</GreyText>
                  <Msg colour={colour}>{message.content}</Msg>
                </div>
              ) : (
                <div key={i}>
                  <Timestamp>{message.time}</Timestamp>
                  <Alert>{message.content}</Alert>
                </div>
              )
            )
          : ""}
      </ChatBox>

      <MsgContainer onSubmit={sendMessage}>
        <MsgBox
          onChange={updatemsgValue}
          value={msgvalue}
          id="m"
          autoComplete="off"
        />
        <MsgSubmit colour={colour}>SEND</MsgSubmit>
      </MsgContainer>

      <div
        ref={scrollTo => {
          msgsEnd = scrollTo;
        }}
      />
    </>
  );
}

//export component to index
export default App;
