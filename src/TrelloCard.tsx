import React, { useContext, CSSProperties } from 'react';
import styled from 'styled-components/macro';
import { MultiboardContext } from './Multiboard';
import Labels, { LabelPill } from './Labels';
import Members from './Members';
import config from './config';

const Wrapper = styled.a<{ background: string }>`
  display: block;
  text-decoration: none;
  color: inherit;

  background-color: ${(props) => props.background};

  padding: 4px;
  border-radius: 4px;

  & + & {
    margin-top: 4px;
  }
`;

const Card = styled.div`
  border-radius: 4px;
  background-color: #fff;
  border-bottom: 1px solid #b3b8c5;

  padding: 4px;
`;

const CardTitle = styled.span``;

const CardFooter = styled.div`
  overflow: auto;
  margin-top: 4px;
`;

const BoardName = styled.small`
  text-transform: uppercase;
  font-size: 10px;
  font-weight: bold;
`;

type CardLabelProps = {
  card: ITrelloCard;
};

function CardLabels({ card }: CardLabelProps) {
  const { showLabelText, toggleShowLabelText } = useContext(MultiboardContext);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    toggleShowLabelText();
  }

  if (card.labels.length === 0) return null;

  return (
    <Labels showLabelText={showLabelText} onClick={handleClick}>
      {card.labels.map((l) => (
        <LabelPill key={l.id} color={l.color}>
          {l.name}
        </LabelPill>
      ))}
    </Labels>
  );
}

const CardMembers = styled(Members)`
  float: right;
`;

export default function TrelloCard({ card }: { card: ITrelloCard }) {
  const { board } = card;
  const boardPrefs = board.prefs;

  const background =
    boardPrefs.backgroundColor ||
    boardPrefs.backgroundTopColor ||
    boardPrefs.backgroundBottomColor ||
    '';

  const url = config.useTrelloApp
    ? card.url.replace(/^https:/, 'trello:')
    : card.url;

  return (
    <Wrapper
      background={background}
      href={url}
      target={config.useTrelloApp ? '' : '_blank'}
    >
      <Card>
        <CardLabels card={card} />
        <CardTitle>{card.name}</CardTitle>
        <CardFooter>
          <CardMembers members={card.members} />
        </CardFooter>
      </Card>
      <BoardName>{board.name}</BoardName>
    </Wrapper>
  );
}
