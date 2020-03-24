import React from 'react';
import styled from 'styled-components/macro';
import Labels, { LabelPill, labelColors } from './Labels';
import { Button, Emoji } from './UI';
import { clearCache } from './utils/api-cache';
import Members from './Members';

export type FilterOptions = {
  label: TrelloLabelColor | null;
  member: ITrelloMember | null;
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
  function filterColor(color: TrelloLabelColor) {
    if (filter.label === color) {
      onUpdateFilter({ ...filter, label: null });
    } else {
      onUpdateFilter({ ...filter, label: color });
    }
  }

  function filterMember(member: ITrelloMember) {
    if (filter.member?.id === member.id) {
      onUpdateFilter({ ...filter, member: null });
    } else {
      onUpdateFilter({ ...filter, member: member });
    }
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
