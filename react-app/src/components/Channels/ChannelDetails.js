import { useParams, NavLink, useHistory, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getOneChannel, getAllChannels, deleteChannel } from "../../store/channels";
import { authenticate } from "../../store/session"
import Chat from "../Socketio/Chat";
import CreateChannel from "./CreateChannel";
import OpenModalButton from '../OpenModalButton/index';
import './index.css'
import JoinChannels from "./JoinChannels";

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

    // console.log("CHANNEL ID IN CHANNEL DETAILS", channelId)

    // This use effect is dispatching the user, all channels, and getting one channel for the information. 
    useEffect(() => {
         dispatch(authenticate())
         dispatch(getAllChannels())
         dispatch(getOneChannel(channelId))
        //   dispatch(getAllChannelMessages(+channelId))
    }, [dispatch, channelId])

    if (!currentUser) <Redirect to="/login" />
    if (!singleChannel || !allChannels) return null

    // The return also contains the workspace title.
    // The list of channels that user joined and owns.
    // On the right component there will be the name of the channel and the message container below.
    // When clicking on the title, the message container will change to a details page that includes description, edit button and delete button. 
    // When clicking on the edit button, it'll go to a page with the Channel's name and description.
    // When clicking on the delete button, it should go back to "/" page and show that the channel is deleted.
    return (
        <div className="main-container">
            <div className="sidebar-container">
                <div className="title-container">
                    <h3 className="title">Slacking Academy</h3>
                </div>
                <div className="create-channel">
                    <h3>Channels</h3>
                    <div className="search-create-button">
                        <OpenModalButton
                            className="search-create-b"
                            buttonText={<i className="fa-solid fa-magnifying-glass"></i>}
                            modalComponent={<JoinChannels />}
                        />
                        <OpenModalButton
                            buttonText={<i className="fa-solid fa-plus"></i>}
                            modalComponent={<CreateChannel />}
                        />
                    </div>
                </div>
                <div className="main-channels">
                    {userChannels.map(({ id, name }) => (
                        <NavLink className="name" key={id} to={`/channels/${id}`}> #{name} </NavLink>
                    ))}
                    {channelsOwned.map(({ id, name }) => (
                        <NavLink className="name" key={id} to={`/channels/${id}`}> #{name} </NavLink>
                    ))}
                </div>
            </div>
            <div className="channel-container">
                <div className="channel-header">
                    <h3 className="upper-left">
                        <NavLink className="channel-name" key={channelId} to={`/channels/${channelId}/info`}>
                            #{singleChannel.name}{" "}{<i className="fa-solid fa-chevron-down"></i>}
                        </NavLink>
                    </h3>
                    <div className="upper=right">
                        <p className='user-number'>
                            {`users: 
                            ${singleChannel.users_joined}`}</p>
                    </div>
                </div>
                <Chat key="chat-key" channelId={channelId} />
            </div>
        </div>
    )

}

export default ChannelDetails