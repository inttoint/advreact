import React from 'react';

import store from "./redux";
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Root from './components/Root';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import history from './history';
import './config';
import './mocks'

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <DndProvider backend={HTML5Backend} >
          <Root />
        </DndProvider>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
