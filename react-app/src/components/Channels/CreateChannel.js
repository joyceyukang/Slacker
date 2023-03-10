import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createChannel, getAllChannels } from '../../store/channels';
import { useModal } from '../../context/Modal';
import '../../context/Modal.css'


const CreateChannel = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user)
    const { closeModal } = useModal();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

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
            dispatch(createChannel(payload)).then(
                (res) => {
                    closeModal()
                    history.push(`/`)
                })
        }
        dispatch(getAllChannels())
    }, [formErrors, dispatch])

    const validate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Name is required."
        } else if (values.name.length > 20) {
            errors.name = "Name of channel must be 20 characters or less."
        }
        if (!values.description) {
            errors.description = "Description is required."
        } else if (values.description.length > 2000) {
            errors.description = "Description must be 2000 characters or less."
        }

        return errors;
    }

    return (
        <div className="inputBox">
            <h2 id='create-header'>Create a Channel</h2>
            <form className="create-input" onSubmit={handleSubmit}>
                <h5 className='input-titles'>Channel Name</h5>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Name"
                    name="name"
                    required
                    max="50"
                />
                <p className='login-sign-form-errors'>{formErrors.name}</p>
                <h5 className='input-titles'>Description</h5>
                <input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Description"
                    name="description"
                    required
                    max="2000"
                />
                <p className='login-sign-form-errors'>{formErrors.description}</p>
                {sessionUser ? <button className="submit" type="submit">Submit</button> :
                    <div><button className="submit" disabled>Submit</button>
                        <p>Must be signed up or logged in to create a spot.</p></div>}
            </form>
        </div>
    )
}

export default CreateChannel;