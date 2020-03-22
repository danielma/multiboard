import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ background: string }>`
  background-color: ${(props) => props.background};
`;

export default function TrelloCard({ card }: { card: ITrelloCard }) {
  return (
    <Wrapper background={card.board.prefs.backgroundColor}>{card.id}</Wrapper>
  );
}
