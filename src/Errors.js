//imports
import React from "react";
import styled from "styled-components";

const ErrorMsg = styled.div`
  background: #23272a;
  border-radius: 8px;
  vertical-align: center;
  margin-top: 0.1em;
  margin-left: 1.5em;
  position: fixed;
  display: flex;
  height: fit-content;
  width: fit-content;
  top: 8em;
  right: 27em;
  padding: 1em;
  color: #e36262;
  flex: 20px;
  flex-wrap: wrap;
  flex-direction: row;
`;

const Exit = styled.div`
  padding-left: 1em;
  font-size: 0.75em;
  :hover {
    cursor: pointer;
  }
`;

//error messages
function Errors(props) {
  return (
    <>
      {props.error !== null ? (
        <ErrorMsg>
          {props.error}
          <Exit onClick={() => props.removeErrors()}>╳</Exit>
        </ErrorMsg>
      ) : (
        <></>
      )}
    </>
  );
}

//export
export default Errors;
