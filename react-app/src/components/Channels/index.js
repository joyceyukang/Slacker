import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllChannels } from "../../store/channels";
import { authenticate } from "../../store/session";

const Channel = () => {
    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.session.user)
    let userChannels;

    if (currentUser) {
        userChannels = currentUser.channels_joined
    }

    useEffect(() => {
        dispatch(getAllChannels())
        dispatch(authenticate())
    }, [dispatch])

    if (!currentUser) return null

    return (
        <div>
            <h1>Hogwarts Academy</h1>
            {userChannels.map(({id, name}) => (
                <NavLink key={name} to={`/channels/${id}`}> #{name} </NavLink>
            ))}
        </div>
    )

}

export default Channel