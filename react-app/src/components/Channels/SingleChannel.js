import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getOneChannel } from "../../store/channels";
import { getAllChannels } from "../../store/channels";
import { authenticate } from "../../store/session";
import Chat from "../Socketio/Chat";
import './index.css'

const SingleChannel = ({ id, name }) => {
    const dispatch = useDispatch()
    const singleChannel = useSelector(state => state.channel.singleChannel)

    useEffect(() => {
        dispatch(authenticate())
        dispatch(getOneChannel(id))
        dispatch(getAllChannels())
    }, [dispatch])

    if (!singleChannel) return null

    return (
        <div className="main-channels">
            <NavLink className="name" key={id} to={`/channels/${id}`}> #{name} </NavLink>
        </div>
    )
}

export default SingleChannel