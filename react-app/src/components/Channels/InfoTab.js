import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getOneChannel, getAllChannels, deleteChannel } from "../../store/channels";
import { authenticate } from "../../store/session"
import CreateChannel from "./CreateChannel";
import EditChannel from "./EditChannel"
import JoinChannels from "./JoinChannels";
import OpenModalButton from '../OpenModalButton/index';
import './index.css'
import './InfoTab.css'

const InfoTab = () => {
    const dispatch = useDispatch()
    const { channelId } = useParams()
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const singleChannel = useSelector(state => state.channel.singleChannel)
    const currentUser = useSelector(state => state.session.user)
    const history = useHistory()

    // To display all channels the user has joined or the user owns
    let userChannels;
    let channelsOwned;
    let channelsOwnedId = [];

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

    // These are pushing the channels id to an array so that I can add an edit button in the channels descriptions
    if (channelsOwned) {
        channelsOwned.forEach(channel => {
            channelsOwnedId.push(channel.id)
        })
    }

    // Delete a Channel
    const deleteChannels = async (e) => {
        e.preventDefault()

        dispatch(deleteChannel(channelId)).then(
            history.push('/')
        )
        dispatch(authenticate())
        alert('Channel Deleted')
    }

    // This use effect is dispatching the user, all channels, and getting one channel for the information. 
    useEffect(() => {
        dispatch(authenticate())
        dispatch(getAllChannels())
        dispatch(getOneChannel(channelId))
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
                <div className="title-container">
                    <h3 className="title">Slacking Academy</h3>
                </div>
                <div className="create-channel">
                    <h3>Channels</h3>
                    <OpenModalButton
                        buttonText={<i className="fa-solid fa-magnifying-glass"></i>}
                        modalComponent={<JoinChannels />}
                    />
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
            <div className="channel-info-container">
                <div className="channel-header">
                    <h3 className="upper-left">
                        #{singleChannel.name}
                    </h3>
                    <div className="upper=right">
                        <p id='user-number'>{singleChannel.users_joined}</p>
                    </div>
                </div>
                <div className='channel-description'>
                    <h3>Description</h3>
                    <p>{singleChannel.description}</p>
                </div>
                <div className="edit-delete-buttons">
                    <span>
                        {channelsOwnedId.includes(+channelId) ?
                            <NavLink className="edit" key={channelId} to={`/channels/${channelId}/edit`}>Edit</NavLink> : null}
                    </span>
                    <span>
                        {channelsOwnedId.includes(+channelId) ?
                            <NavLink className="delete" key={singleChannel.name} onClick={deleteChannels} to='/'>Delete</NavLink> : null}
                    </span>
                </div>
            </div>
        </div>
    )

}

export default InfoTab;