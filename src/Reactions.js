//imports
import React, { useState } from "react";
import styled from "styled-components";
import * as consts from "./constants";
import openSocket from "socket.io-client";

const reactions = consts.reactions;
let socket = openSocket("http://kan5048:3001");

const Holder = styled.div`
  display: flex;
  color: white;

  flex-wrap: wrap;
  flex-direction: row;
`;

//button for expanding reactions menu
const Expand = styled.div`
  color: white;

  padding-left: 0.5em;
  padding-top: 0.7em;
  font-size: 1em;
  :hover {
    cursor: pointer;
  }
`;

//container for reactions
const ReactionsContainer = styled.div`
  background: #23272a;
  border-radius: 8px;
  vertical-align: center;
  margin-top: 0.1em;
  margin-left: 1.5em;
  position: absolute;
  display: flex;
  height: 4%;
  width: fit-content;

  color: white;
  flex: 20px;
  flex-wrap: wrap;
  flex-direction: row;
`;

//actual reactions
const Reaction = styled.div`
  color: white;
  border: none;
  width: 1em;
  height: 1em;
  margin: 0.5em;

  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
  }
`;

//reactions component
function Reactions(props) {
  //state for whether or not reactions should show
  const [show, setShow] = useState(false);

  //function to show or hide reactions menu
  function showhide() {
    //set show to the opposite of what it is (ex. false => true)
    setShow(!show);
  }

  //emit that someone reacted to the backend
  function addReaction(msg, moji) {
    //if user has not already reacted to this
    if (props.reacted.indexOf(props.index) === -1) {
      socket.emit("reaction", msg, moji);

      //add message this to reacted
      props.addReacted(props.index);
    } else {
      //send error to addReacted
      props.addReacted("error");
    } //hide the menu
    showhide();
  }

  //showing component
  return (
    <Holder>
      <Expand onClick={() => showhide()}>⋮</Expand>
      {show ? (
        <ReactionsContainer>
          {reactions.map(reaction => (
            <Reaction
              key={reaction}
              onClick={() => addReaction(props.index, reaction)}
            >
              {reaction}
            </Reaction>
          ))}
        </ReactionsContainer>
      ) : (
        <></>
      )}
    </Holder>
  );
}

//export
export default Reactions;
