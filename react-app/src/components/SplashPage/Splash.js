import React from "react";
import './Splash.css'
import screen from './screen.png'

const SplashPage = () => {

    return (
        <div className="splash-container">
            <div className="splash-backdrop">
                <div className="splash-card-container">
                    <div className="splash-card">
                        <h1>Welcome to slacker!</h1>
                        <h4>Where slacking happens...</h4>
                        <img src={screen} 
                        alt="Girl in a jacket"
                        width="550px"
                        height="250px"
                        ></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashPage