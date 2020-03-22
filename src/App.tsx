import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import './App.css';
import Multiboard from './Multiboard';
import styled from 'styled-components';

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

const AppContainer = styled.div``;

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

      <AppContainer>
        {trelloReady ? <Multiboard /> : 'Waiting for trello :)'}
      </AppContainer>
    </>
  );
}
