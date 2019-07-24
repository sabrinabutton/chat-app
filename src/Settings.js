//import react and styled components
import React from "react";
import styled from "styled-components";

//container for the settings and menu
const SettingsContainer = styled.div`
  background: #23272a;
  padding: 1em;
  margin: 1em;
  position: fixed;
  top: 7em;
  right: -1em;
  width: 20%;
  height: 70%;

  color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;
//parent style for colour customization buttons
const Button = styled.button`
  width: 6%;
  height: 6%;
  border-radius: 8px;
  margin: 1em;
  color: white;
  border: none;
  padding: 1em;
  :focus {
    outline: none;
  }
`;
//container for the colour selection buttons
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

//colour selection buttons
const YButton = styled(Button)`
  background: #fcba03;
`;
const RButton = styled(Button)`
  background: #e36262;
`;
const BButton = styled(Button)`
  background: #7289da;
`;
const GButton = styled(Button)`
  background: #a5de7e;
`;
const PButton = styled(Button)`
  background: #b47ede;
`;
const NButton = styled(Button)`
  background: #000000;
`;

//styled for names of online users
const Online = styled.li`
  color: #a5de7e;
  margin: 0.5em;
  margin-top: 1.5em;
`;

//title style
const Title = styled.div`
  color: white;
  font-size: 1em;
  margin: 0.5em;
`;

//settings (menu) component
function Settings(props) {
  return (
    <SettingsContainer>
      <Title>Colours</Title>
      <ButtonContainer>
        <RButton
          onClick={() => {
            props.changeColour("#e36262");
          }}
        />
        <YButton
          onClick={() => {
            props.changeColour(" #fcba03");
          }}
        />
        <GButton
          onClick={() => {
            props.changeColour("#a5de7e");
          }}
        />
        <BButton
          onClick={() => {
            props.changeColour("#7289da");
          }}
        />
        <PButton
          onClick={() => {
            props.changeColour("#b47ede");
          }}
        />
        <NButton
          onClick={() => {
            props.changeColour("#000000");
          }}
        />
      </ButtonContainer>

      <Title>Online ({props.online.length})</Title>
      {props.online.map(user => (
        <Online key={user.id}>
          {user.name} @ {user.id.substring(7, 20)}
        </Online>
      ))}
    </SettingsContainer>
  );
}

//export
export default Settings;
