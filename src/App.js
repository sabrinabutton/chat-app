//import react, styled components, components, socket and declare variable (msgsEnd) which will allow bottom scrolling but does not require state
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Settings from "./Settings";
import openSocket from "socket.io-client";
import EmojiKeys from "./EmojiKeys";
import Reactions from "./Reactions";
import Errors from "./Errors";
let socket = openSocket("http://kan5048:3001");
let msgsEnd;

//ERRORS
const msgTooLong =
  "Messages can only be between 1 and 300 characters. (⟃ ͜ʖ ⟄) ";
const nameTooLong =
  "Nickname can only be between 1 and 20 characters and cannot be the same as previous nickname. ( ͡◉ ͜ʖ ͡◉)";
const reactOnce = "You can only react to a message once. ( ͡~ ͜ʖ ͡°)";

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
  :hover {
    cursor: pointer;
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
  width: 85%;
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
  padding: 1em;
  position: fixed;
  display: flex;
`;
//container for message sending portion of screen
const MsgContainer = styled(Container)`
  background: #23272a;
  bottom: 0;
  width: 100%;
  color: white;
`;
//container for user name setting portion of screen
const UserContainer = styled(Container)`
  background: #23272a;
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
//message components container
const MsgComponents = styled.div`
  display: flex;
  flex-direction: row;
`;
//styling for showing reactions to messages
const MsgReactionsBox = styled.div`
  color: white;
  margin-top: 0.25em;
  margin-left: 5.5em;
  margin-right: 1em;
  display: flex;
  flex-direction: row;

  padding: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.25em;
`;
const MsgReactions = styled.div`
  padding-right: 0.5em;
  padding-left: 0.5em;
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
  //current error
  const [error, setError] = useState(null);
  //reacted  messages
  const [reacted, setReacted] = useState([]);

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

    if (uservalue.length > 0 && uservalue.length < 20) {
      //emit to backend that user was set and send new user
      socket.emit("set user", uservalue);
    }
    //else, send error
    else {
      setError(nameTooLong);
    }
  }

  //function to send a message
  function sendMessage(event) {
    //prevent reload
    event.preventDefault();
    if (msgvalue.length > 0 && msgvalue.length < 300) {
      //emit to backend that a message was sent and send the message
      socket.emit("chat message", msgvalue);
      //set typing to false
      typing = false;
      //set the value of the input box for messages to blank (spam prevention)
      setmsgValue("");
    }
    //else, send error
    else {
      setError(msgTooLong);
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

  //function to remove error on x press
  function removeErrors() {
    setError(null);
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

  function addEmoji(moji) {
    setmsgValue(msgvalue + moji);
    if (!typing) {
      //emit to backend that user is typing
      socket.emit("typing");
      //set typing to true
      typing = true;
    }
  }

  function addReacted(msgIndex) {
    //if the message was not found in reacted
    if (msgIndex !== "error") {
      const local = reacted;
      local.push(msgIndex);
      setReacted(local);
    }
    //if is error
    else {
      setError(reactOnce);
    }
  }

  return (
    <>
      <TitleBar>(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</TitleBar>
      <Errors error={error} removeErrors={removeErrors} />
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
        {messages.slice(messages.length - 50).length !== 0
          ? messages.slice(messages.length - 50).map((message, i) =>
              message.type === "message" ? (
                <div key={i}>
                  <Timestamp>{message.time}</Timestamp>
                  <GreyText>{message.user}</GreyText>
                  <MsgComponents>
                    <Msg colour={colour}>{message.content}</Msg>{" "}
                    <Reactions
                      index={i}
                      reacted={reacted}
                      addReacted={addReacted}
                    />
                  </MsgComponents>

                  <MsgReactionsBox>
                    {message.reactions.map(reaction => (
                      <MsgReactions key={reaction.emoji}>
                        {reaction.emoji}
                        {reaction.amt}
                      </MsgReactions>
                    ))}
                  </MsgReactionsBox>
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
        <EmojiKeys type="button" addEmoji={addEmoji} colour={colour} />
        <MsgBox
          onChange={updatemsgValue}
          value={msgvalue}
          id="m"
          autoComplete="off"
        />

        <MsgSubmit type="submit" colour={colour}>
          SEND
        </MsgSubmit>
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
