import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './NavBarChannel.css'

const NavBarChannel = ({ loaded }) => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='nav-container-channel'>
      <div id='upper-navigation'>
        <div className='upper-left-home'>
          <NavLink id="nav-channel-logo" to='/channels'>
            <h2>slacker</h2>
          </NavLink>
        </div>
        <div className='upper-right-buttons'>
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

export default NavBarChannel;