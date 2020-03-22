import React, { useState, useEffect } from 'react';
import { getBoards, getLists, getCards, getMembers } from './utils/trello';
import styled from 'styled-components';
import TrelloCard from './TrelloCard';

type TrelloMultiList = {
  name: string;
  lists: TrelloList[];
  cards: ITrelloCard[];
};

export const MultiboardContext = React.createContext<{
  boards: TrelloBoard[];
  members: ITrelloMember[];
}>({ boards: [], members: [] });

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
  background-color: #d3d5da;
  border-radius: 3px;
  padding: 8px;
  width: 290px;
`;

export default function Multiboard() {
  const [boards, setBoards] = useState<TrelloBoard[]>([]);
  const [members, setMembers] = useState<ITrelloMember[]>([]);
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
    <MultiboardContext.Provider value={{ members, boards }}>
      <Container>
        {lists.map((list) => (
          <List key={list.name}>
            <ListTitle>{list.name}</ListTitle>
            {list.cards
              .sort(
                (cA, cB) =>
                  new Date(cB.dateLastActivity).getTime() -
                  new Date(cA.dateLastActivity).getTime()
              )
              .map((card) => (
                <TrelloCard key={card.id} card={card} />
              ))}
          </List>
        ))}
      </Container>
    </MultiboardContext.Provider>
  );
}
