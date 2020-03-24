import React, { useState, useEffect } from 'react';
import { getBoards, getLists, getMembers } from './utils/trello';
import styled from 'styled-components/macro';
import store from 'store2';
import MultiList from './MultiList';
import Labels, { LabelPill, labelColors } from './Labels';
import Members from './Members';
import { Button, Emoji, List } from './UI';
import { useInterval } from './utils/hooks';
import { clearCache } from './utils/api-cache';

function useMultiLists(boards: TrelloBoard[]): TrelloMultiList[] {
  const [multiLists, setMultiLists] = useState<{
    [key: string]: TrelloMultiList;
  }>({});

  useEffect(() => {
    async function effect() {
      const listGets = await Promise.all(boards.map(getLists));

      const loadedLists = listGets.flatMap((lg) => lg.forcedValue());

      let ml: { [key: string]: TrelloMultiList } = {};

      loadedLists.forEach((list) => {
        if (!ml[list.name]) {
          ml[list.name] = {
            name: list.name,
            lists: [],
            config: list.config,
          };
        }

        ml[list.name].lists.push(list);
      });

      setMultiLists(ml);
    }

    effect();
  }, [boards, setMultiLists]);

  return Object.values(multiLists);
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 16px;
`;

export const MultiboardContext = React.createContext<{
  boards: TrelloBoard[];
  members: ITrelloMember[];
  showLabelText: boolean;
  toggleShowLabelText: () => void;
}>({
  boards: [],
  members: [],
  showLabelText: false,
  toggleShowLabelText: () => undefined,
});

function toggle(oldValue: boolean) {
  return !oldValue;
}

function useCachedToggle(
  initialValue: boolean,
  cacheKey: string
): [boolean, () => void] {
  const [value, setValue] = useState(
    store.has(cacheKey) ? store.get(cacheKey) : initialValue
  );

  return [
    value,
    () => {
      store.set(cacheKey, toggle(value));
      setValue(toggle(value));
    },
  ];
}

type FilterOptions = {
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

function FilterBar({ members, filter, onUpdateFilter }: FilterBarProps) {
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
    <>
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
      <hr style={{ marginBottom: '4px' }} />
    </>
  );
}

export default function Multiboard() {
  const [boards, setBoards] = useState<TrelloBoard[]>([]);
  const [members, setMembers] = useState<ITrelloMember[]>([]);
  const [showLabelText, toggleShowLabelText] = useCachedToggle(
    false,
    'showLabelText'
  );
  const [filter, setFilter] = useState<FilterOptions>({
    label: null,
    member: null,
    reloadCounter: 0,
  });
  const lists = useMultiLists(boards);

  useEffect(() => {
    getMembers().then((members) => {
      setMembers(members.forcedValue());
    });

    getBoards().then((boards) => {
      setBoards(boards.forcedValue());
    });
  }, []);

  useInterval(() => {
    setFilter({ ...filter, reloadCounter: filter.reloadCounter + 1 });
  }, 30000);

  const filterCards = React.useCallback(
    function (incomingCards: ITrelloCard[]) {
      let cards = incomingCards;

      if (filter.label) {
        const { label } = filter;
        cards = cards.filter((c) =>
          c.labels.map((l) => l.color).includes(label)
        );
      }

      if (filter.member) {
        const { member } = filter;

        cards = cards.filter((c) => c.idMembers.includes(member.id));
      }

      return cards;
    },
    [filter]
  );

  return (
    <MultiboardContext.Provider
      value={{ members, boards, showLabelText, toggleShowLabelText }}
    >
      <Container>
        <FilterBar
          members={members}
          filter={filter}
          onUpdateFilter={setFilter}
        />
        <List.Container>
          {lists.map((list) => (
            <MultiList
              key={list.name}
              list={list}
              filterCards={filterCards}
              reloadCounter={filter.reloadCounter}
            />
          ))}
        </List.Container>
      </Container>
    </MultiboardContext.Provider>
  );
}
