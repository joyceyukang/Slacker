import { useParams, NavLink, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllChannels, deleteChannel, getOneChannel } from "../../store/channels";
import { authenticate } from "../../store/session";
import CreateChannel from "./CreateChannel";
import OpenModalButton from '../OpenModalButton/index';
import JoinChannels from "./JoinChannels";

const Channel = () => {
    const dispatch = useDispatch()
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const currentUser = useSelector(state => state.session.user)


    // List of user channels which are the channels that the user "joined".
    let userChannels;

    // List of channels owned/created by user.
    let channelsOwned

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

    // This use effect will trigger the dispatches for getting all channels and the user information. 
    useEffect(() => {
        dispatch(getAllChannels())
        // dispatch(getOneChannel(1))
        // dispatch(authenticate())
    }, [dispatch])

    if (!currentUser) return <Redirect to="/login" />

    if (!allChannels) return null

    // The return contains the title of the workspace which will be permanent for now.
    // Next to the channel subtitle is the create a channel button.
    // A list of the channels that the user joined and the user owns.
    // Once you click on a channel in the list it should open up a component to the right that shows the specific channel and the messages.
    // The above is linked to the component "ChannelDetails".
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
            <div className="channel-container-body">
                <i className="fa-brands fa-slack logo-body"></i>
                <h3>Click a Channel to start chatting!</h3>
            </div>
        </div>
    )

}

export default Channel