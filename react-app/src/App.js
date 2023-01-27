import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/Navigation/NavBar';
import NavBarChannel from './components/Navigation/NavBarChannel'
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import Channel from './components/Channels';
import ChannelDetails from './components/Channels/ChannelDetails';
import Chat from './components/Socketio/Chat';
import SingleChannel from './components/Channels/SingleChannel';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <NavBar loaded={loaded} />
        </Route>
        <Route exact path='/login' >
          <NavBar loaded={loaded} />
          <LoginForm />
        </Route>
        <Route exact path='/sign-up' >
          <NavBar loaded={loaded} />
          <SignUpForm />
        </Route>
        <ProtectedRoute exact path='/users'  >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute exact path='/users/:userId'  >
          <User />
        </ProtectedRoute>
        <Route exact path='/channels/:channelId'>
          <NavBarChannel />
          <ChannelDetails />
        </Route>
        <ProtectedRoute path='/channels'>
          <NavBarChannel />
          <Channel />
        </ProtectedRoute>
        <Route path='/messages'>
          <Chat />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
