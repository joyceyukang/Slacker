import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import channel, { getOneChannel, getAllChannels, deleteChannel } from "../../store/channels";
import { authenticate } from "../../store/session"
import Chat from "../Socketio/Chat";
import CreateChannel from "./CreateChannel";
import OpenModalButton from '../OpenModalButton/index';
import './index.css'
import EditChannel from "./EditChannel";

const ChannelDetails = () => {
    const dispatch = useDispatch()
    const { channelId } = useParams()
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const singleChannel = useSelector(state => state.channel.singleChannel)
    const currentUser = useSelector(state => state.session.user)
    const history = useHistory()

    let userChannels;
    let channelsOwned;

    console.log('CHANNEL ID', channelId)

    if (currentUser) {
        userChannels = currentUser.channels_joined;
        if (allChannels) {
            console.log('OWNED CHANNELS')
            channelsOwned = allChannels.filter(channel => (
                channel.owner_id === currentUser.id
            ))
        }
    }

    const removeChannel = async () => {
        // console.log("BUSINESS ID",business.id)
        await dispatch(deleteChannel(channelId))
        await dispatch(authenticate())
        history.push('/channels')
        alert('Channel Deleted')
    }

    useEffect(() => {
        console.log('USE EFFECT')
        dispatch(authenticate())
        dispatch(getAllChannels())
        dispatch(getOneChannel(channelId))
    }, [dispatch, channelId])

    if (!currentUser || !singleChannel || !allChannels) return null

    console.log('SINGLE CHANNEL ID', singleChannel)

    return (
        <div className="main-container">
            <div className="sidebar-container">
                <h2 id="title">Hogwarts Academy</h2>
                <div className="create-edit-delete-channel">
                    <p>Channels</p>
                    <OpenModalButton
                        buttonText="+"
                        modalComponent={<CreateChannel />}
                    />
                </div>
                <div className="main-channels">
                    {userChannels.map(({ id, name }) => (
                        <NavLink className="name" key={id} to={`/channels/${id}`}> #{name} </NavLink>
                    ))}
                    {channelsOwned.map(({ id, name }) => (
                        <span className="owners-channels">
                            <NavLink className="name" key={id} to={`/channels/${id}`}> #{name} </NavLink>
                            <span>
                                <OpenModalButton
                                    buttonText="edit"
                                    modalComponent={<EditChannel id={id} />}
                                />
                                <button onClick={removeChannel}>
                                    delete
                                </button>
                            </span>
                        </span>
                    ))}
                </div>
            </div>
            <div className="channel-container">
                <div className="channel-header">
                    <h2 className="upper-left">{singleChannel.name}</h2>
                    <div className="upper=right">
                        <p id='user-number'>{singleChannel.users_joined}</p>
                    </div>
                </div>
                <div className='message-container'>
                </div>
                <div className="chat-box">
                    {/* <Chat /> */}
                </div>
            </div>
        </div>
    )

}

export default ChannelDetails