import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import Channel from './components/Channels';
import ChannelDetails from './components/Channels/ChannelDetails';
import Chat from './components/Socketio/Chat';

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
      <NavBar />
      <ProtectedRoute path='/'>
        <Channel />
      </ProtectedRoute>
      <Switch>
        <Route exact path='/login' >
          <LoginForm />
        </Route>
        <Route exact path='/sign-up' >
          <SignUpForm />
        </Route>
        <ProtectedRoute exact path='/users'  >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute exact path='/users/:userId'  >
          <User />
        </ProtectedRoute>
        <Route path='/channels/:channelId'>
          <ChannelDetails />
        </Route>
        <Route path='/messages'>
          <Chat />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
