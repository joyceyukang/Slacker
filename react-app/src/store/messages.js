const LOAD_MESSAGES = 'messages/LOAD'
const CREATE_MESSAGES = 'messages/CREATE'
const UPDATE_MESSAGES = 'messages/UPDATE'
const DELETE_MESSAGES = 'messages/DELETE'
const GET_ONE_MESSAGE = 'messages/GET_ONE'

const load = messages => ({
    type: LOAD_MESSAGES,
    messages
})

const create = message => ({
    type: CREATE_MESSAGES,
    message
})

const update = message => ({
    type: UPDATE_MESSAGES,
    message
})


const getOne = message => ({
    type: GET_ONE_MESSAGE,
    message
})

const remove = messageId => ({
    type: DELETE_MESSAGES,
    messageId
})

// Get a single message
export const getOneMessage = (id) => async dispatch => {
    const response = await fetch(`/api/messages/${id}`);
    if (response.ok){
        const messages = await response.json()
        dispatch(getOne(messages))
        return messages
    }
}

// Get all existing messages
export const getAllMessages = () => async dispatch => {
    const response = await fetch('/api/messages/')

    if (response.ok) {
        const messages = await response.json();
        dispatch(load(messages))
        return messages;
    }
}

// Create a message
export const createMessage = (message, channelId) => async dispatch => {
    const response = await fetch(`/api/messages/${channelId}/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    })
    
    if (response.ok) {
        const newMessage = await response.json();
        dispatch(create(newMessage))
        return newMessage
    }
}

// Update an exisiting message
export const editmessage = (message, id) => async dispatch => {
    const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    })

    if(response.ok) {
        const updateMessage = await response.json()
        dispatch(update(updateMessage))
        return updateMessage
    }
}

export const deletemessage = (id) => async dispatch => {
    const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
    })

    if(response.ok) {
        await response.json()
        dispatch(remove(id))
    }
}

const initialState = { allMessages: {}, singleMessage: {} }

const message = (state = initialState, action) => {
    let newState;
    let newAllMessages;
    let newSingleMessage;
    switch (action.type) {
        case LOAD_MESSAGES:
            newState = { ...state };
            newAllMessages = {...state.allMessages}
            action.messages.messages.forEach(message => {
                newAllMessages[message.id] = message;
            })
            newState.allMessages = newAllMessages;
            return newState;
        case CREATE_MESSAGES:
            newState = { ...state };
            newSingleMessage = action.message
            newState.allMessages[newSingleMessage.id] = newSingleMessage
            return newState;
        case GET_ONE_MESSAGE:
            newState = { ...state };
            newSingleMessage = action.message
            newState.singleMessage = newSingleMessage
            return newState;
        case UPDATE_MESSAGES:
            newState = {...state};
            newSingleMessage = action.message
            newState.allMessages[newSingleMessage.id] = newSingleMessage;
            return newState;
        case DELETE_MESSAGES:
            newState = {...state};
            newAllMessages = {...state.allMessages};
            delete newAllMessages[action.messageId]
            newState.allMessages = newAllMessages;
            return newState;
        default:
            return state
    }
}

export default message