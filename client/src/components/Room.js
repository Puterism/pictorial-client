import React from 'react';
import styled from 'styled-components';

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `
}

function Room() {
  return (
    <Styled.Container>
      Room
    </Styled.Container>
  )
}

export default Room;