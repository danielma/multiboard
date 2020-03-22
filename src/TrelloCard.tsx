import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { MultiboardContext } from './Multiboard';

const Wrapper = styled.a<{ background: string }>`
  display: block;
  text-decoration: none;
  color: inherit;

  background-color: ${(props) => props.background};

  padding: 4px;
  border-radius: 2px;

  & + & {
    margin-top: 4px;
  }
`;

const Card = styled.div`
  border-radius: 2px;
  background-color: #fff;
  border-bottom: 1px solid #b3b8c5;

  padding: 4px;
`;

const CardTitle = styled.span``;

const CardFooter = styled.div`
  overflow: auto;
  margin-top: 4px;
`;

const Members = styled.ul`
  list-style-type: none;
  margin: 0;
  float: right;
`;

const BoardName = styled.small`
  text-transform: uppercase;
  font-size: 10px;
  font-weight: bold;
`;

type AvatarSize = 30 | 50 | 170;

function avatarUrl(member: ITrelloMember, size: AvatarSize): string {
  return `https://trello-avatars.s3.amazonaws.com/${member.avatarHash}/${size}.png`;
}

function AvatarImage({
  member,
  className = '',
}: {
  member: ITrelloMember;
  className?: string;
}) {
  return (
    <img
      className={className}
      height='30'
      width='30'
      src={avatarUrl(member, 30)}
      srcSet={`${avatarUrl(member, 30)} 1x, ${avatarUrl(member, 50)} 2x`}
    />
  );
}

const Avatar = styled(AvatarImage)`
  border-radius: 50%;
`;

export default function TrelloCard({ card }: { card: ITrelloCard }) {
  const { members } = useContext(MultiboardContext);
  const { board } = card;
  const boardPrefs = board.prefs;

  const background =
    boardPrefs.backgroundColor ||
    boardPrefs.backgroundTopColor ||
    boardPrefs.backgroundBottomColor;

  const realMembers: ITrelloMember[] = card.idMembers
    .map((id) => members.find((m) => m.id === id)!)
    .filter((m) => m);

  return (
    <Wrapper background={background || ''} href={card.url} target='_blank'>
      <Card>
        <CardTitle>{card.name}</CardTitle>
        <CardFooter>
          <Members>
            {realMembers.map((m) => (
              <Avatar key={m.id} member={m} />
            ))}
          </Members>
        </CardFooter>
      </Card>
      <BoardName>{board.name}</BoardName>
    </Wrapper>
  );
}
