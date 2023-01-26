import { useParams, Link, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getOneChannel } from "../../store/channels";
import { authenticate } from "../../store/session";
import Chat from "../Socketio/Chat";

const ChannelDetails = () => {
    const dispatch = useDispatch()
    const { channelId } = useParams()
    const singleChannel = useSelector( state => state.channel.singleChannel)
    const currentUser = useSelector(state => state.session.user)

    let userChannels;

    if (currentUser) {
        userChannels = currentUser.user_channels
    }

    useEffect(() => {
        dispatch(getOneChannel(channelId))
    }, [dispatch])

    if (!currentUser || !singleChannel) return null

    return (
        <div>
            <h2>{singleChannel.name}</h2>
            <p>{singleChannel.users_joined}</p>
            <p>{singleChannel.description}</p>
            <p>Messages would go here</p>
            <Chat />
        </div>

    )

}

export default ChannelDetails