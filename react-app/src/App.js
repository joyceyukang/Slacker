import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/Navigation/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import Channel from './components/Channels';
import ChannelDetails from './components/Channels/ChannelDetails';
import Chat from './components/Socketio/Chat';
import EditChannel from './components/Channels/EditChannel';
import InfoTab from './components/Channels/InfoTab';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)

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
    <NavBar loaded={loaded} />
      <Switch>
        <Route exact path='/'>
          the splash page
        </Route>
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
        <ProtectedRoute exact path='/channels' component={Channel} />
        <ProtectedRoute exact path='/channels/:channelId' >
          <ChannelDetails />
        </ProtectedRoute>
        <ProtectedRoute exact path='/channels/:channelId/info' component={InfoTab} />
        <ProtectedRoute exact path='/channels/:channelId/edit' component={EditChannel} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
