import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getOneChannel, getAllChannels, deleteChannel } from "../../store/channels";
import { getAllChannelMessages } from "../../store/messages";
import { authenticate } from "../../store/session"
import Chat from "../Socketio/Chat";
import CreateChannel from "./CreateChannel";
import OpenModalButton from '../OpenModalButton/index';
import './index.css'

const ChannelDetails = () => {
    const dispatch = useDispatch()
    const { channelId } = useParams()
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const singleChannel = useSelector(state => state.channel.singleChannel)
    const currentUser = useSelector(state => state.session.user)

    // To display all channels the user has joined or the user owns
    let userChannels;
    let channelsOwned;

    // If there is a user then we will set userChannels to a list of the channels joined.
    if (currentUser) {
        userChannels = currentUser.channels_joined

        // This is filtering the list of ALL the channels to see if the users id matches the owner_id in the channels. If it does then we put it in an list of channels
        if (allChannels) {
            channelsOwned = allChannels.filter(channel => (
                channel.owner_id === currentUser.id
            ))
        }
    }

    console.log("CHANNEL ID IN CHANNEL DETAILS", channelId)

    // This use effect is dispatching the user, all channels, and getting one channel for the information. 
    useEffect(async () => {
        await dispatch(authenticate())
        await dispatch(getAllChannels())
        await dispatch(getOneChannel(channelId))
        // await  dispatch(getAllChannelMessages(+channelId))
    }, [dispatch, channelId])

    if (!currentUser || !singleChannel || !allChannels) return null

    // The return also contains the workspace title.
    // The list of channels that user joined and owns.
    // On the right component there will be the name of the channel and the message container below.
    // When clicking on the title, the message container will change to a details page that includes description, edit button and delete button. 
    // When clicking on the edit button, it'll go to a page with the Channel's name and description.
    // When clicking on the delete button, it should go back to "/channels" page and show that the channel is deleted.
    return (
        <div className="main-container">
            <div className="sidebar-container">
                <h2 className="title">Slacking Academy</h2>
                <div className="create-channel">
                    <h3>Channels</h3>
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
                        <span key={name} className="owners-channels">
                            <NavLink className="name" key={id} to={`/channels/${id}`}> #{name} </NavLink>
                        </span>
                    ))}
                </div>
            </div>
            <div className="channel-container">
                <div className="channel-header">
                    <h2 className="upper-left">
                        <NavLink key={channelId} to={`/channels/${channelId}/info`}>
                            #{singleChannel.name}
                        </NavLink>
                    </h2>
                    <div className="upper=right">
                        <p id='user-number'>
                            {`users: 
                            ${singleChannel.users_joined}`}</p>
                    </div>
                </div>

                <Chat channelId={channelId} />

            </div>
        </div>
    )

}

export default ChannelDetails