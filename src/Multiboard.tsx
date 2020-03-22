import React, { useState, useEffect } from 'react';
import { getBoards, getLists, getCards, getMembers } from './utils/trello';
import styled from 'styled-components/macro';
import store from 'store2';
import TrelloCard from './TrelloCard';
import Labels, { LabelPill, labelColors } from './Labels';
import Members from './Members';

type TrelloMultiList = {
  name: string;
  lists: TrelloList[];
  cards: ITrelloCard[];
};

function useMultiLists(
  boards: TrelloBoard[],
  reloadCounter: number
): TrelloMultiList[] {
  const [lists, setLists] = useState<TrelloList[]>([]);
  const [multiLists, setMultiLists] = useState<TrelloMultiList[]>([]);

  useEffect(() => {
    async function effect() {
      const listGets = await Promise.all(boards.map(getLists));

      setLists(listGets.flatMap((lg) => lg.forcedValue()));
    }

    effect();
  }, [boards]);

  useEffect(() => {
    async function effect() {
      let multiLists: { [key: string]: TrelloMultiList } = {};

      lists.forEach((list) => {
        if (multiLists[list.name]) {
          multiLists[list.name].lists.push(list);
        } else {
          multiLists[list.name] = {
            name: list.name,
            lists: [list],
            cards: [],
          };
        }
      });

      Object.values(multiLists).map(async (multiList) => {
        const cardGets = await Promise.all(
          multiList.lists.map((l) =>
            getCards(l, { skipCache: reloadCounter > 0 })
          )
        );

        cardGets
          .flatMap((cg) => cg.forcedValue())
          .forEach((card) => {
            multiList.cards.push(card);
          });

        setMultiLists(Object.values(multiLists));
      });
    }

    effect();
  }, [lists, reloadCounter]);

  return multiLists;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 16px;
`;

const Lists = styled.div`
  flex: 1;
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;

  > div {
    margin-right: 8px;
  }
`;

const ListTitle = styled.h2`
  margin-bottom: 8px;
`;

const List = styled.div`
  background-color: #ebecf0;
  border-radius: 3px;
  padding: 8px;
  width: 290px;

  display: inline-flex;
  flex-direction: column;
`;

const ListBody = styled.div`
  flex: 1;
  overflow: auto;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  ::-webkit-scrollbar:vertical {
    width: 11px;
  }

  ::-webkit-scrollbar:horizontal {
    height: 11px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid #ebecf0; /* should match background, can't be transparent */
    background-color: rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }
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
        <button
          onClick={() =>
            onUpdateFilter({
              ...filter,
              reloadCounter: filter.reloadCounter + 1,
            })
          }
        >
          Reload
        </button>
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

  const lists = useMultiLists(boards, filter.reloadCounter);

  useEffect(() => {
    getMembers().then((members) => {
      setMembers(members.forcedValue());
    });

    getBoards().then((boards) => {
      setBoards(boards.forcedValue());
    });
  }, []);

  function getCardsForList(list: TrelloMultiList): ITrelloCard[] {
    let cards = list.cards;

    if (filter.label) {
      const { label } = filter;
      cards = cards.filter((c) => c.labels.map((l) => l.color).includes(label));
    }

    if (filter.member) {
      const { member } = filter;

      cards = cards.filter((c) => c.idMembers.includes(member.id));
    }

    return cards.sort(
      (cA, cB) =>
        new Date(cB.dateLastActivity).getTime() -
        new Date(cA.dateLastActivity).getTime()
    );
  }

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
        <Lists>
          {lists.map((list) => (
            <List key={list.name}>
              <ListTitle>{list.name}</ListTitle>
              <ListBody>
                {getCardsForList(list).map((card) => (
                  <TrelloCard key={card.id} card={card} />
                ))}
              </ListBody>
            </List>
          ))}
        </Lists>
      </Container>
    </MultiboardContext.Provider>
  );
}
