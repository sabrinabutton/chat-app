//im doing this so eric can emoji spam
//imports
import React, { useState } from "react";
import styled from "styled-components";
import * as consts from "./constants";
const emojiList = consts.emojiList;

const EmojiKeyboard = styled.div`
  background: #23272a;
  border-radius: 8px;
  padding: 1em;
  position: fixed;
  display: flex;
  bottom: 5em;
  width: 20%;
  height: 30%;
  color: white;
  flex: 1 4 500px;
  flex-wrap: wrap;
  flex-direction: row;
  overflow-y: scroll;
`;

const EmojiPrompt = styled.button`
  border-radius: 8px;
  background: ${props => props.colour};
  color: white;
  border: none;
  width: 3%;
  margin-left: 1em;
  margin-right: 1em;
  padding: 1em;

  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
  }
`;

const Emoji = styled.div`
  color: white;
  border: none;
  width: 1em;
  height: 1em;
  margin: 0.5em;
  padding: 0.5em;

  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
  }
`;

function EmojiKeys(props) {
  
  const [show, setShow] = useState("false");

  function showHide() {
    console.log("here");
    setShow(!show);
  }

  return (
    <>
      <EmojiPrompt
        type="button"
        onClick={() => showHide()}
        colour={props.colour}
      >
        :)
      </EmojiPrompt>
      {show === true ? (
        <EmojiKeyboard>
          {emojiList === undefined ? (
            <>Emojis loading... ◕‿◕</>
          ) : (
            emojiList.map((emoji, i) => (
              <Emoji role="img" key={i} onClick={() => props.addEmoji(emoji)}>
                {emoji}
              </Emoji>
            ))
          )}
        </EmojiKeyboard>
      ) : (
        ""
      )}
    </>
  );
}

//export component
export default EmojiKeys;
