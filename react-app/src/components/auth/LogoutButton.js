import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../../store/session';

const LogoutButton = () => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    // e.preventDefault()
    await dispatch(logout())
    .then(
      console.log('LOGGED OUT')
      // <Redirect to='/login' />
    )
    .catch(
      console.log('CATCH ME')
    )
  };

  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
