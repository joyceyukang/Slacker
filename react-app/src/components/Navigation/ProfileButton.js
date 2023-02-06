import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { Link, NavLink, useHistory } from "react-router-dom";
import './NavBar'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory()

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    useEffect(() => {
        if (!showMenu) return;

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        setShowMenu(false)
        history.push('/')
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div>
            <button className="profile-button" onClick={openMenu}>
                <i className="fa-sharp fa-solid fa-user"></i>
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <div className="dropdown-menu">
                    <>
                        <li className='user-info'>{user.username}</li>
                        <li className='user-info'>{user.email}</li>
                        <li>
                            <button className="logout" onClick={logout}>Log Out</button>
                        </li>
                        <li className="about-me">
                            <span>
                                Developed by
                            </span>
                            <a className="user-link" href="https://github.com/joyceyukang">Joyce Kang</a>
                        </li>
                    </>
                </div>
            </ul>
        </div>
    );
}

export default ProfileButton;
