import React, { useState, useEffect } from 'react';
import { getBoards, getLists, getCards } from './utils/trello';
import styled from 'styled-components';
import TrelloCard from './TrelloCard';

type TrelloMultiList = {
  name: string;
  lists: TrelloList[];
  cards: ITrelloCard[];
};

function useMultiLists(): TrelloMultiList[] {
  const [lists, setLists] = useState<TrelloMultiList[]>([]);

  useEffect(() => {
    async function effect() {
      const boards = await getBoards();

      let multiLists: { [key: string]: TrelloMultiList } = {};

      boards.flatMap(async (boards) => {
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
      });
    }

    effect();
  }, []);

  return lists;
}

const Container = styled.div`
  display: flex;
  margin: 16px;

  > div {
    margin-right: 16px;
  }
`;

const ListTitle = styled.h2`
  margin-bottom: 8px;
`;

const List = styled.div``;

export default function Multiboard() {
  const lists = useMultiLists();

  return (
    <Container>
      {lists.map((list) => (
        <List key={list.name}>
          <ListTitle>{list.name}</ListTitle>
          {list.cards.map((card) => (
            <TrelloCard key={card.id} card={card} />
          ))}
        </List>
      ))}
    </Container>
  );
}
