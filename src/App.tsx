import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import logo from './logo.svg';
import './App.css';

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
      () => window.TrelloReady,
      () => setTrelloReady(true)
    );
  }, []);

  return (
    <>
      <Helmet>
        <script
          src={`https://trello.com/1/client.js?key=${process.env.REACT_APP_TRELLO_API_KEY}`}
        />
      </Helmet>

      <div className='App'>
        <header className='App-header'>
          {trelloReady ? 'READY' : 'NOT READY'}
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
      </div>
    </>
  );
}
