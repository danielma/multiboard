import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { DateTime } from 'luxon';
import { MultiboardContext } from './Multiboard';
import Labels, { LabelPill } from './Labels';
import Members from './Members';
import config from './config';

const BoardName = styled.small`
  text-transform: uppercase;
  font-size: 10px;
  font-weight: bold;
`;

const Wrapper = styled.a<{ background: string; variant: 'dark' | 'light' }>`
  display: block;
  text-decoration: none;
  color: inherit;

  background-color: ${(props) => props.background};

  padding: 4px;
  border-radius: 4px;

  & + & {
    margin-top: 4px;
  }

  ${BoardName} {
    color: ${(p) => (p.variant === 'dark' ? '#fff' : '#555')};
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
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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

function UnstyledCardComment(
  props: { comment: ITrelloComment } & React.HTMLAttributes<HTMLDivElement>
) {
  const { comment, ...rest } = props;
  return <div {...rest}>{comment.data.text}</div>;
}

const CardComment = styled(UnstyledCardComment)`
  white-space: pre-line;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.07);
  border-radius: 4px;
`;

const CardMembers = styled(Members)``;

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

  const comment = card.list.config.showLastComment && card.comments[0];

  return (
    <Wrapper
      background={background}
      variant={boardPrefs.backgroundBrightness}
      href={url}
      target={config.useTrelloApp ? '' : '_blank'}
    >
      <Card>
        <CardLabels card={card} />
        {card.list.config.showCardTitle && <CardTitle>{card.name}</CardTitle>}
        {comment && <CardComment comment={comment} />}
        <CardFooter>
          {comment && (
            <span style={{ flex: 1 }}>
              {DateTime.fromISO(comment.date).toFormat('L/d')}
            </span>
          )}
          <CardMembers members={card.members} />
        </CardFooter>
      </Card>
      <BoardName>{board.name}</BoardName>
    </Wrapper>
  );
}
