import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllChannels} from "../../store/channels";
import { authenticate } from "../../store/session";
import '../../context/Modal.css'
import './JoinChannels.css'

const JoinChannels = () => {
    const dispatch = useDispatch()
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const currentUser = useSelector(state => state.session.user)

    // List of user channels which are the channels that the user "joined".
    let userChannels;
    let userChannelsId = [];


    // List of channels owned/created by user.
    let channelsOwned
    let channelsOwnedId = [];

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

            channelsOwned.forEach(channel => (
                channelsOwnedId.push(channel.id)
            ))
        }
    }

    console.log(channelsOwned)
    console.log(channelsOwnedId)

    const handleAdd = async (id) => {

        const response = await fetch(`/api/users/${id}/join`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" }
        })
        const message = await response.json();
        if(message) {
            dispatch(authenticate())
            dispatch(getAllChannels())
        }
    };

    // This use effect will trigger the dispatches for getting all channels and the user information. 
    useEffect(() => {
        dispatch(authenticate())
        dispatch(getAllChannels())
    }, [dispatch])

    if (!currentUser || !allChannels) return null

    // List of channels to join channels that user has not joined yet
    return (
        <div className="main-container">
            <div className="all-channels-container">
                    <h3 className="acl-header">
                        All Channels
                    </h3>
                <div className="acl-container">
                    {allChannels.map(({ id, name }) => (
                        <div className="acl">
                            <span className="channel-name">
                              { `#${name}`}
                            </span>
                            <span className="acl-button-container">
                                { channelsOwnedId.includes(id) || userChannelsId.includes(id) ?
                                    <button className="joined-b"
                                    disabled>
                                        Joined
                                    </button> :
                                    <button className="join-b" 
                                    onClick={() => {
                                        handleAdd(id)
                                    }}>
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