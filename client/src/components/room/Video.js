import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export const StyledDiv = styled.div`
  position: relative;
  width: auto;
  height: 40vh;
  border: 1px solid black;
  border-radius: 5%;
  background-color: black;
  box-shadow: 0 3px 5px 2px rgba(181, 99, 247, 0.3);
`;

export const Styledpara = styled.p`
  position: absolute;
  left: 20px;
  bottom: 9px;
  z-index: 10;
  font-size: 25px;
  color: white;
`;

export const StyledVideo = styled.video`
  height: 100%;
  width: auto;
  border-radius: 5%;
  object-fit: fill;
  z-index: 5;
`;

//video component to display video
const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <StyledDiv>
      <StyledVideo playsInline autoPlay ref={ref} />
      <Styledpara>{props.name}</Styledpara>
    </StyledDiv>
  );
};

export default Video;
