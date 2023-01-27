import { useParams, NavLink, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllChannels } from "../../store/channels";
import { authenticate } from "../../store/session";
import CreateChannel from "./CreateChannel";
import OpenModalButton from '../OpenModalButton/index';

const Channel = () => {
    const dispatch = useDispatch()
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const currentUser = useSelector(state => state.session.user)
    let userChannels;
    let channelsOwned

    if (currentUser) {
        userChannels = currentUser.channels_joined

        if (allChannels) {
            channelsOwned = allChannels.filter(channel => (
                channel.owner_id === currentUser.id
            ))
        }
    }

    useEffect(() => {
        dispatch(getAllChannels())
        dispatch(authenticate())
    }, [dispatch])

    if (!currentUser || !allChannels) return null

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
                                    modalComponent={<EditChannel id={id}/>}
                                />
                                <button>
                                    delete
                                </button>
                            </span>
                        </span>
                    ))}
                </div>
            </div>
            <div className="channel-container">

            </div>
        </div>
    )

}

export default Channel