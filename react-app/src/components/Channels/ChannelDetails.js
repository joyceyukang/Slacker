import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getOneChannel } from "../../store/channels";
import { getAllChannels } from "../../store/channels";
import { useModal } from "../../context/Modal";
import Chat from "../Socketio/Chat";
import './index.css'

const ChannelDetails = () => {
    const dispatch = useDispatch()
    const { channelId } = useParams()
    const singleChannel = useSelector(state => state.channel.singleChannel)
    const currentUser = useSelector(state => state.session.user)

    let userChannels;

    if (currentUser) {
        userChannels = currentUser.channels_joined
    }

    console.log(currentUser)

    useEffect(() => {
        dispatch(getOneChannel(channelId))
        dispatch(getAllChannels())
    }, [dispatch])

    if (!currentUser || !singleChannel) return null

    return (
        <div className="whole-container">
            <div className="main-channels">
                {userChannels.map(({ id, name }) => (
                    <NavLink className="name" key={name} to={`/channels/${id}`}> #{name} </NavLink>
                ))}
            </div>
            <div className="channel-container">
                <div className="channel-header">
                    <h2 className="upper-left">{singleChannel.name}</h2>
                    <div className="upper=right">
                        <p id='user-number'>{singleChannel.users_joined}</p>
                        <p id='description'>{singleChannel.description}</p>
                    </div>
                </div>
                <p className="chat-box">Messages would go here</p>
                <div className="chat-box">
                    {/* <Chat /> */}
                </div>
            </div>
        </div>

    )

}

export default ChannelDetails