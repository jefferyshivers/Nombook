import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import application from '../react/src/reducers';
import Nombook from '../react/src/Nombook';

let store = createStore(
  application
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Nombook />
    </Provider>,
    document.getElementById('app'));
})

// store.subscribe(() => { console.log(store.getState()) })
