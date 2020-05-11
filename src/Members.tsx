import React from 'react';
import styled from 'styled-components/macro';

type AvatarSize = 30 | 50 | 170;

function avatarUrl(member: ITrelloMember, size: AvatarSize): string {
  return `${member.avatarUrl}/${size}.png`;
}

function AvatarImage({
  member,
  onClick = () => undefined,
  className = '',
}: {
  member: ITrelloMember;
  onClick: () => void;
  className?: string;
}) {
  return (
    <img
      onClick={onClick}
      className={className}
      height='30'
      width='30'
      src={avatarUrl(member, 30)}
      srcSet={`${avatarUrl(member, 30)} 1x, ${avatarUrl(member, 50)} 2x`}
      alt={member.id}
    />
  );
}

const Avatar = styled(AvatarImage)`
  border-radius: 50%;
  cursor: pointer;
`;

const FadedAvatar = styled(Avatar)`
  opacity: 0.5;
`;

function Members({
  members,
  onMemberClick = () => undefined,
  focused = null,
  className = '',
}: {
  members: ITrelloMember[];
  onMemberClick?: (member: ITrelloMember) => void;
  focused?: ITrelloMember | null;
  className?: string;
}) {
  return (
    <ul className={className}>
      {members.map((m) =>
        focused && focused.id !== m.id ? (
          <FadedAvatar key={m.id} member={m} onClick={() => onMemberClick(m)} />
        ) : (
          <Avatar key={m.id} member={m} onClick={() => onMemberClick(m)} />
        )
      )}
    </ul>
  );
}

export default styled(Members)`
  list-style-type: none;
  margin: 0;
`;
