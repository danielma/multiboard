import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ background: string }>`
  background-color: ${(props) => props.background};
`;

export default function TrelloCard({ card }: { card: ITrelloCard }) {
  const boardPrefs = card.board.prefs;

  const background =
    boardPrefs.backgroundColor ||
    boardPrefs.backgroundTopColor ||
    boardPrefs.backgroundBottomColor;

  return <Wrapper background={background || ''}>{card.name}</Wrapper>;
}
