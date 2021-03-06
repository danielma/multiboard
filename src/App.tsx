import React, { useEffect, useState } from 'react';
import config from './config';
import Helmet from 'react-helmet';
import './App.css';
import Multiboard from './Multiboard';
import styled from 'styled-components/macro';

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

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: stretch;
`;

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
        <title>{config.name}</title>
        <script
          src={`https://trello.com/1/client.js?key=${process.env.REACT_APP_TRELLO_API_KEY}`}
        />
      </Helmet>

      <AppContainer>
        {trelloReady ? <Multiboard /> : 'Waiting for trello :)'}
      </AppContainer>
    </>
  );
}
