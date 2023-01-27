import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createChannel, getAllChannels } from '../../store/channels';
import { useModal } from '../../context/Modal';


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
                    history.push(`/channels`)
                })
        }
        dispatch(getAllChannels())
    }, [formErrors, dispatch])

    const validate = (values) => {
        const errors = {};

        // console.log(values)

        if (!values.name) {
            errors.name = "Name is required."
        }
        if (!values.description) {
            errors.description = "Description is required."
        }

        return errors;
    }

    //    reset();
    // const reset = () => {
    //     setname('');
    //     setCity('');
    //     setState('');
    //     setCountry('');
    //     setName('');
    //     setDescription('');
    //     setPrice('');
    //     setImageUrl('');
    // }

    return (
        <div className="inputBox">
            <h1>Create a Channel</h1>
            <form className="create-input" onSubmit={handleSubmit}>
                <h5>Channel Name</h5>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Name"
                    name="name"
                // required
                />
                <p>{formErrors.name}</p>
                <h5>Description</h5>
                <input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Description"
                    name="description"
                // required
                />
                <p>{formErrors.description}</p>
                {sessionUser ? <button className="submit" type="submit">Submit</button> :
                    <div><button className="submit" disabled>Submit</button>
                        <p>Must be signed up or logged in to create a spot.</p></div>}
            </form>
        </div>
    )
}

export default CreateChannel;