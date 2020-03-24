import React, { useState, useEffect } from 'react';
import TrelloCard from './TrelloCard';
import { List } from './UI';
import { getCards } from './utils/trello';

function sortCardsForList(
  list: TrelloMultiList,
  cards: ITrelloCard[]
): ITrelloCard[] {
  switch (list.config.sort) {
    case 'lastModified':
      return cards.sort(
        (cA, cB) =>
          new Date(cB.dateLastActivity).getTime() -
          new Date(cA.dateLastActivity).getTime()
      );
    case 'lastAction':
      return cards.sort((cA, cB) => {
        const cADate =
          cA.actions && cA.actions.length > 0
            ? new Date(cA.actions[0].date)
            : new Date(cA.dateLastActivity);
        const cBDate =
          cB.actions && cB.actions.length > 0
            ? new Date(cB.actions[0].date)
            : new Date(cB.dateLastActivity);

        return cBDate.getTime() - cADate.getTime();
      });
  }
}

export default function MultiList({
  list,
  filterCards,
  reloadCounter,
}: {
  list: TrelloMultiList;
  filterCards: (cards: ITrelloCard[]) => ITrelloCard[];
  reloadCounter: number;
}) {
  const [cards, setCards] = useState<ITrelloCard[]>([]);
  const sortedCards = sortCardsForList(list, filterCards(cards));

  useEffect(() => {
    async function effect() {
      const cardGets = await Promise.all(list.lists.map(getCards));

      setCards(cardGets.flatMap((cg) => cg.forcedValue()));
    }

    effect();
  }, [reloadCounter, list.lists, reloadCounter]);

  return (
    <List.List>
      <List.Title>{list.name}</List.Title>
      <List.Body>
        {sortedCards.map((card) => (
          <TrelloCard key={card.id} card={card} />
        ))}
      </List.Body>
    </List.List>
  );
}
