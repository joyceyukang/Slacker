import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllChannels, deleteChannel, getOneChannel } from "../../store/channels";
import { authenticate } from "../../store/session";
import CreateChannel from "./CreateChannel";
import OpenModalButton from '../OpenModalButton/index';
import './index.css'

const JoinChannels = () => {
    const dispatch = useDispatch()
    const listChannels = useSelector(state => state.channel.allChannels)
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const currentUser = useSelector(state => state.session.user)
    const history = useHistory()


    // List of user channels which are the channels that the user "joined".
    let userChannels;
    let userChannelsId = [];


    // List of channels owned/created by user.
    let channelsOwned

    // If there is a user then we will set userChannels to a list of the channels joined.
    if (currentUser) {
        userChannels = currentUser.channels_joined
        userChannels.forEach(channel => {
            userChannelsId.push(channel.id)
        });

        // userChannelsId = 
        // This is filtering the list of ALL the channels to see if the users id matches the owner_id in the channels. If it does then we put it in an list of channels
        if (allChannels) {
            channelsOwned = allChannels.filter(channel => (
                channel.owner_id === currentUser.id
            ))
        }
    }

    // This use effect will trigger the dispatches for getting all channels and the user information. 
    useEffect(() => {
        dispatch(authenticate())
        dispatch(getAllChannels())
    }, [dispatch])

    if (!currentUser || !allChannels) return null

    // The return contains the title of the workspace which will be permanent for now.
    // Next to the channel subtitle is the create a channel button.
    // A list of the channels that the user joined and the user owns.
    // Once you click on a channel in the list it should open up a component to the right that shows the specific channel and the messages.
    // The above is linked to the component "ChannelDetails".
    return (
        <div className="main-container">
            <div className="sidebar-container">
                <h3 className="title">Slacking Academy</h3>
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
                        <NavLink className="name" key={id} to={`/channels/${id}`}> #{name} </NavLink>
                    ))}
                </div>
            </div>
            <div className="channel-container">
                <div className="channel-header">
                    <h3 className="upper-left">
                        All Channels
                    </h3>
                </div>
                <div className="all-channel-list">
                    {allChannels.map(({ id, name }) => (
                        <div>
                            <span>
                              { `#${name}`}
                            </span>
                            <span>
                                {userChannelsId.includes(id) ?
                                    <button disabled>
                                        Joined
                                    </button> :
                                    <button >
                                        Join
                                    </button>}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default JoinChannels