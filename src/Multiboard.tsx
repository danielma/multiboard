import React, { useState, useEffect, SetStateAction } from 'react';
import { getBoards, getLists, getCards, getMembers } from './utils/trello';
import styled from 'styled-components/macro';
import store from 'store2';
import TrelloCard from './TrelloCard';

type TrelloMultiList = {
  name: string;
  lists: TrelloList[];
  cards: ITrelloCard[];
};

function useMultiLists(boards: TrelloBoard[]): TrelloMultiList[] {
  const [lists, setLists] = useState<TrelloMultiList[]>([]);

  useEffect(() => {
    async function effect() {
      let multiLists: { [key: string]: TrelloMultiList } = {};

      const listGets = await Promise.all(boards.map(getLists));

      listGets
        .flatMap((lg) => lg.forcedValue())
        .forEach((list) => {
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
        const cardGets = await Promise.all(multiList.lists.map(getCards));

        cardGets
          .flatMap((cg) => cg.forcedValue())
          .forEach((card) => {
            multiList.cards.push(card);
          });

        setLists(Object.values(multiLists));
      });
    }

    effect();
  }, [boards]);

  return lists;
}

const Container = styled.div`
  display: inline-flex;
  margin: 16px;

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

  display: flex;
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

export default function Multiboard() {
  const [boards, setBoards] = useState<TrelloBoard[]>([]);
  const [members, setMembers] = useState<ITrelloMember[]>([]);
  const [showLabelText, toggleShowLabelText] = useCachedToggle(
    false,
    'showLabelText'
  );
  const lists = useMultiLists(boards);

  useEffect(() => {
    getMembers().then((members) => {
      setMembers(members.forcedValue());
    });

    getBoards().then((boards) => {
      setBoards(boards.forcedValue());
    });
  }, []);

  return (
    <MultiboardContext.Provider
      value={{ members, boards, showLabelText, toggleShowLabelText }}
    >
      <Container>
        {lists.map((list) => (
          <List key={list.name}>
            <ListTitle>{list.name}</ListTitle>
            <ListBody>
              {list.cards
                .sort(
                  (cA, cB) =>
                    new Date(cB.dateLastActivity).getTime() -
                    new Date(cA.dateLastActivity).getTime()
                )
                .map((card) => (
                  <TrelloCard key={card.id} card={card} />
                ))}
            </ListBody>
          </List>
        ))}
      </Container>
    </MultiboardContext.Provider>
  );
}
