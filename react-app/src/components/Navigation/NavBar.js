import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './NavBar.css'

const NavBar = ({ loaded }) => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='nav-container'>
      <div id='upper-navigation'>
        <div className='upper-left-home'>
          <h2>Slacker</h2>
        </div>
        <div className='upper-right-buttons'>
            {!sessionUser && (
            <div className='nav-buttons-container'>
              <div className='nav-button'>
                <NavLink exact to="/login">
                  <button className='login-button'>
                  Log In
                  </button>
                </NavLink>
              </div>
              <div className='nav-button'>
                <NavLink exact to="/sign-up">
                  <button className='signup-button'>
                    Sign Up
                  </button>
                </NavLink>
                </div>
              </div>
            )}
            {sessionUser && (
              <div className='nav-buttons-container'>
              <ProfileButton user={sessionUser} />
            </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;