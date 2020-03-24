import React from 'react';
import styled from 'styled-components/macro';
import Labels, { LabelPill, labelColors } from './Labels';
import { Button, Emoji, Checkbox } from './UI';
import { clearCache } from './utils/api-cache';
import Members from './Members';

export const defaultFilter: FilterOptions = {
  label: null,
  member: null,
  reloadCounter: 0,
  onlyWatching: false,
};

export function buildCardFilter(
  filter: FilterOptions
): (cards: ITrelloCard[]) => ITrelloCard[] {
  return function (incomingCards: ITrelloCard[]) {
    let cards = incomingCards;

    if (filter.label) {
      const { label } = filter;
      cards = cards.filter((c) => c.labels.map((l) => l.color).includes(label));
    }

    if (filter.member) {
      const { member } = filter;

      cards = cards.filter((c) => c.idMembers.includes(member.id));
    }

    if (filter.onlyWatching) {
      cards = cards.filter((c) => c.subscribed);
    }

    return cards;
  };
}

export type FilterOptions = {
  label: TrelloLabelColor | null;
  member: ITrelloMember | null;
  onlyWatching: boolean;
  reloadCounter: number;
};

type FilterBarProps = {
  members: ITrelloMember[];
  filter: FilterOptions;
  onUpdateFilter: (newFilter: FilterOptions) => void;
};

const Bar = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin-right: 8px;
  }
`;

export default function FilterBar({
  members,
  filter,
  onUpdateFilter,
}: FilterBarProps) {
  function filterColor(color: NonNullable<FilterOptions['label']>) {
    if (filter.label === color) {
      onUpdateFilter({ ...filter, label: null });
    } else {
      onUpdateFilter({ ...filter, label: color });
    }
  }

  function filterMember(member: NonNullable<FilterOptions['member']>) {
    if (filter.member?.id === member.id) {
      onUpdateFilter({ ...filter, member: null });
    } else {
      onUpdateFilter({ ...filter, member: member });
    }
  }

  function toggleOnlyWatching() {
    onUpdateFilter({ ...filter, onlyWatching: !filter.onlyWatching });
  }

  return (
    <Bar>
      <Labels showLabelText>
        {Object.keys(labelColors).map((color) => (
          <LabelPill
            key={color}
            color={color as TrelloLabelColor}
            focused={filter.label ? filter.label === color : undefined}
            onClick={() => filterColor(color as TrelloLabelColor)}
          >
            {color}
          </LabelPill>
        ))}
      </Labels>
      <Members
        members={members}
        onMemberClick={filterMember}
        focused={filter.member}
      />
      <Checkbox onChange={toggleOnlyWatching}>Watching</Checkbox>
      <Button
        onClick={() =>
          onUpdateFilter({
            ...filter,
            reloadCounter: filter.reloadCounter + 1,
          })
        }
      >
        Reload cards
      </Button>
      <Button
        onClick={() => {
          clearCache();
          window.location.reload();
        }}
      >
        Clear cache <Emoji emoji='🔥' />
      </Button>
    </Bar>
  );
}
