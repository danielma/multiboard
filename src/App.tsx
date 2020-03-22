import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import './App.css';
import { getBoards, getLists, getCards } from './utils/trello';

function backoff(done: () => boolean, callback: () => void): void {
  let time = 50;
  const exponent = 1.5;

  function work() {
    console.log('backoff', time);
    if (done()) {
      callback();
    } else {
      setTimeout(work, time);
      time = time * exponent;
    }
  }

  work();
}

export default function App() {
  const [trelloReady, setTrelloReady] = useState(false);

  useEffect(() => {
    backoff(
      () => !!window.Trello,
      () => {
        window.Trello.authorize({
          name: 'Multiboard',
          expiration: 'never',
          success: function () {
            setTrelloReady(true);
          },
        });
      }
    );
  }, []);

  return (
    <>
      <Helmet>
        <script
          src={`https://trello.com/1/client.js?key=${process.env.REACT_APP_TRELLO_API_KEY}`}
        />
      </Helmet>

      {trelloReady ? <TheActualApp /> : 'Waiting for trello :)'}
    </>
  );
}

type TrelloMultiList = {
  name: string;
  lists: TrelloList[];
  cards: TrelloCard[];
};

function TheActualApp() {
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

  return (
    <div>
      <pre>{JSON.stringify(lists, null, 4)}</pre>
    </div>
  );
}
