import React from "react";
import './Splash.css'
import screen from './screen.png'
import splash from './splash.png'

const SplashPage = () => {

    return (
        <div className="splash-container">
            <div className="splash-backdrop">
                <div className="splash-card-container">
                    <div className="splash-card">
                        <img src={splash} 
                        alt="img"
                        width="600px"
                        height="400px"
                        ></img>
                        <div>
                        <h1>Welcome to slacker!</h1>
                        <h4>Where chatting happens...</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashPage