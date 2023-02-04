import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import { editChannel, getAllChannels, getOneChannel } from '../../store/channels';
import CreateChannel from "./CreateChannel";
import JoinChannels from './JoinChannels';
import OpenModalButton from '../OpenModalButton/index';

const EditChannel = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const allChannels = Object.values(useSelector(state => state.channel.allChannels))
    const { channelId } = useParams()
    const sessionUser = useSelector(state => state.session.user)

    // To display all channels the user has joined or the user owns
    let userChannels;
    let channelsOwned;

    // If there is a user then we will set userChannels to a list of the channels joined.
    if (sessionUser) {
        userChannels = sessionUser.channels_joined

        // This is filtering the list of ALL the channels to see if the users id matches the owner_id in the channels. If it does then we put it in an list of channels
        if (allChannels) {
            channelsOwned = allChannels.filter(channel => (
                channel.owner_id === sessionUser.id
            ))
        }
    }

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        dispatch(getOneChannel(channelId)).then((res) => {
            setName(res.name)
            setDescription(res.description)
        })
    }, [dispatch, channelId])

    const payload = {
        name,
        description
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormErrors(validate(payload))
        setIsSubmit(true)
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            dispatch(editChannel(payload, channelId)).then(
                (res) => {
                    dispatch(getAllChannels())
                    history.push(`/channels/${channelId}`)
                }
            )
        }
    }, [formErrors, dispatch])

    const validate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Name is required."
        }
        if (!values.description) {
            errors.description = "Description is required."
        }

        return errors;
    }

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
                        <span key={id} className="owners-channels">
                            <NavLink className="name" key={name} to={`/channels/${id}`}> #{name} </NavLink>
                        </span>
                    ))}
                </div>
            </div>
            <div className='channel-container'>
                <div className="edit-form">
                    <div className='channel-header'>
                        <h3 className='upper-left'>#Edit a Channel</h3>
                    </div>
                    <form className="edit-input" onSubmit={handleSubmit}>
                        <h5>Channel Name</h5>
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Name"
                            name="name"
                            required
                        />
                        <p>{formErrors.name}</p>
                        <h5>Description</h5>
                        <input
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder="Description"
                            name="description"
                            required
                        />
                        <p>{formErrors.description}</p>
                        {sessionUser ? <button className="submit" type="submit" onClick={
                            async e => {
                                await dispatch(getAllChannels())
                            }
                        }>Submit</button> :
                            <div><button className="submit" disabled>Submit</button>
                                <p>Must be signed up or logged in to create a spot.</p></div>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditChannel;