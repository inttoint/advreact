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
      <DndProvider backend={HTML5Backend} >
        <ConnectedRouter history={history}>
          <Root />
        </ConnectedRouter>
      </DndProvider>
    </Provider>
  );
}

export default App;
