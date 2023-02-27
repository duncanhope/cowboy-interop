import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-rows: 200px 1fr;

  & > div {
    border: 5px solid black;
    padding: 10px;
  }
`;

const FirstRow = styled.div`
  grid-row: 1 / span 1;
`;

const SecondRow = styled.div`
  grid-row: 2 / span 1;
`;

export function Grid() {
  return (
    <Container>
      <FirstRow>First row (200px)</FirstRow>
      <SecondRow>Second row (remaining space)</SecondRow>
    </Container>
  );
}
