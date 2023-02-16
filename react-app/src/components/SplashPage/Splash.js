import React from "react";
import { NavLink } from "react-router-dom"
import './Splash.css'
import screen from './screen.png'
import little from './little.png'
import bubble from './bubble.png'

const SplashPage = () => {

    return (
        <div className="splash-container">
            <div className="splash-backdrop">
                <div className="splash-card-container">
                    <div className="splash-card">
                        <div className="splash-headers">
                            <h1>🙌 🙌🏻 🙌🏼 Welcome to slacker! 🙌🏽 🙌🏾 🙌🏿</h1>
                        </div>
                        <div className="splash-img">
                            <img
                                className="bubble"
                                src={bubble}
                                alt="img"
                                width="200px"
                                height="175px"
                            ></img>
                            <img
                                className="screen"
                                src={screen}
                                alt="img"
                                width="600px"
                                height="325px"
                            ></img>
                        </div>
                        <div className="splash-girl">
                            <img src={little}
                                alt="img"
                                width="300px"
                                height="215px"
                            ></img>
                            <div className="splash-question">
                                <h2>
                                    Wanna chat? 👀
                                </h2>
                                <h2 className="splash-note">
                                    <NavLink to='/login'>Log in</NavLink>
                                    &nbsp;
                                    or
                                    &nbsp;
                                    <NavLink to='/sign-up'>Sign up</NavLink>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashPage