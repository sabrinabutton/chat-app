import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Settings from "./Settings";
import openSocket from "socket.io-client";
let socket = openSocket("http://kan5048:3001");
let msgsEnd;

const UserSubmit = styled.button`
  width: 20%;
  border-radius: 8px;
  background: ${props => props.colour};
  color: white;
  border: none;
  height: 3em;
  padding: 1em;
  margin-top: 1em;
  :focus {
    outline: none;
  }
`;
const MsgSubmit = styled.button`
  width: 6%;
  border-radius: 8px;
  background: ${props => props.colour};
  color: white;
  border: none;
  padding: 1em;
  :focus {
    outline: none;
  }
`;
const UserBox = styled.input`
  border: 0;
  background: #2c2f33;
  color: white;
  border-radius: 8px;
  padding: 1em;
  width: 70%;
  margin: 1em;
  :focus {
    outline: none;
  }
`;

const MsgBox = styled.input`
  border: 0;
  background: #2c2f33;
  color: white;
  border-radius: 8px;
  padding: 1em;
  width: 90%;
  margin-right: 0.5%;
  :focus {
    outline: none;
  }
`;

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

const Prompt = styled.div`
  color: white;

  margin: 1em;
  margin-top: 1.5em;
`;

const MsgContainer = styled.form`
  background: #23272a;
  padding: 1em;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
`;
const UserContainer = styled.form`
  background: #23272a;
  padding: 1em;
  position: fixed;
  top: 0;
  right: 0;
  width: 20%;
  color: white;
  border-radius: 8px;
  display: flex;
`;
const Msg = styled.div`
  padding: 1em;
  margin: 1em;
  border-radius: 8px;
  display: inline-block;
  background: ${props => props.colour};
  width: fit-content;
  color: white;
`;
const Alert = styled.div`
  padding: 1em;
  margin: 0.5em;
  display: inline-block;
  width: fit-content;
  color: grey;
`;
const ChatBox = styled.div`
  background: #2c2f33;
  margin-top: 8em;
  margin-bottom: 6em;
  padding: 0;

  box-sizing: border-box;
`;
const Timestamp = styled.div`
  padding: 1em;
  margin: 0.5em;
  display: inline;

  color: grey;
`;

function App() {
  const [msgvalue, setmsgValue] = useState("");
  const [uservalue, setuserValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [colour, setColour] = useState("#2c2f33");
  const [online, setOnline] = useState([]);

  async function fetchOnline() {
    const res = await fetch("http://kan5048:3001/api/online/");

    const results = await res.json();
    setOnline(results);
  }

  function setUsername(event) {
    event.preventDefault();
    socket.emit("set user", uservalue);
  }

  function sendMessage(event) {
    event.preventDefault();
    socket.emit("chat message", msgvalue);
    setmsgValue("");
  }

  function updatemsgValue(event) {
    setmsgValue(event.target.value);
  }

  function updateuserValue(event) {
    setuserValue(event.target.value);
  }

  async function fetchMessages() {
    const res = await fetch("http://kan5048:3001/api/messages/");

    const results = await res.json();
    setMessages(results);
  }

  function scrollToBottom() {
    msgsEnd.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  });

  socket.on("new message", () => {
    fetchMessages();
    fetchOnline();
  });

  function changeColour(c) {
    console.log("here");
    setColour(c);
  }

  return (
    <>
      <TitleBar>discord but fake</TitleBar>
      <UserContainer onSubmit={setUsername}>
        <Prompt>Nickname</Prompt>
        <UserBox
          id="u"
          autoCnomplete="off"
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

export default App;
