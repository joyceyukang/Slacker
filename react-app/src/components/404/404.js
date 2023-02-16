import React from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import './404.css'

function PageNotFound() {
    return (
        <div className='nfp-parent'>
            <p className='nfp-404'>
                ⚡️404⚡️
                <br></br>
                Uh Oh! Page not found 🤖 
            </p>
            <p className='nfp-uhoh'>
                <NavLink to='/'>Let's go home 🏠 🏃‍♂️</NavLink>
            </p>
        </div>
    )
}

export default PageNotFound