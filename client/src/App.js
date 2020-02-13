import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { ConnectedRouter as Router } from 'connected-react-router';
import styled from 'styled-components';
import { history } from './store/configureStore';
import SignIn from './components/SignIn';
import Room from './components/Room';

const Styled = {
  Container: styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #2c3e50;
  `
}

function App() {
  return (
    <Styled.Container>
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <SignIn />
          </Route>
          <Route exact path="/room">
            <Redirect to="/" />
          </Route>
          <Route path="/room/:id">
            <Room />
          </Route>
        </Switch>
      </Router>
    </Styled.Container>
  );
}

export default App;
