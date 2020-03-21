import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import './App.css';
import config from './config.json';
import { getBoards } from './utils/trello';

function backoff(done: () => boolean, callback: () => void): void {
  let time = 50;
  const exponent = 1.5;

  function work() {
    if (done()) {
      callback();
    } else {
      setTimeout(work, time);
      time = time ** exponent;
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

function TheActualApp() {
  useEffect(() => {
    getBoards().then((r) => console.log(r));
  }, []);
  return (
    <div>
      hey yeah! <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
}
