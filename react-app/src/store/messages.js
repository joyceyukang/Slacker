import channel from "./channels"

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
// export const getOneMessage = (id) => async dispatch => {
//     const response = await fetch(`/api/messages/${id}`);
//     if (response.ok){
//         const messages = await response.json()
//         dispatch(getOne(messages))
//         return messages
//     }
// }

// Get all existing messages
// export const getAllMessages = () => async dispatch => {
//     const response = await fetch('/api/messages/')

//     if (response.ok) {
//         const messages = await response.json();
//         dispatch(load(messages))
//         return messages;
//     }
// }

export const getAllChannelMessages = (channelId) => async dispatch => {
    const response = await fetch(`/api/messages/${channelId}/messages`)

    if(response.ok) {
        const allMessages = await response.json()
        dispatch(load(allMessages))
        return allMessages
    }
}

// Create a message
export const createMessage = (payload) => async dispatch => {
    const response = await fetch(`/api/messages/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    
    if (response.ok) {
        const newMessage = await response.json();
        dispatch(create(newMessage))
        return newMessage
    }
}

// Update an exisiting message
export const editMessage = (messageId, payload) => async dispatch => {
    const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })

    if(response.ok) {
        const updateMessage = await response.json()
        dispatch(update(updateMessage))
        return updateMessage
    }
}

export const deleteMessage = (messageId) => async dispatch => {
    const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE'
    })

    if(response.ok) {
        await response.json()
        dispatch(remove(messageId))
    }
}

const initialState = { allChannelMessages: {}, singleChannelMessage: {} }

const messages = (state = initialState, action) => {
    let newState;
    let newSingleChannelMessage;
    switch (action.type) {
        case LOAD_MESSAGES:
            newState = { ...state };
            newState.allChannelMessages = {};
            action.messages.channelMessages.forEach(message => {
                newState.allChannelMessages[message.id] = message;
            })
            return newState;
        case CREATE_MESSAGES:
            newState = { ...state };
            newSingleChannelMessage = action.message
            newState.allChannelMessages[newSingleChannelMessage.id] = newSingleChannelMessage
            return newState;
        case GET_ONE_MESSAGE:
            newState = { ...state };
            newSingleChannelMessage = action.message
            newState.singleChannelMessage = newSingleChannelMessage
            return newState;
        case UPDATE_MESSAGES:
            // console.log("NEW STATE",newState)
            newSingleChannelMessage = action.message
            newState = {
                allChannelMessages: {...state.allChannelMessages},
                singleChannelMessage: {...state.singleChannelMessage}
            };
            // console.log("NEW MESSAGE",newSingleChannelMessage)
            newState.allChannelMessages[newSingleChannelMessage.id] = newSingleChannelMessage;
            // console.log("NEW STATE AFTER UPDATING MESSAGE", newState)
            return newState;
        case DELETE_MESSAGES:
            newState = {
                allChannelMessages: {...state.allChannelMessages},
                singleChannelMessage: {...state.singleChannelMessage}
            };
            delete newState.allChannelMessages[action.messageId]
            return newState;
        default:
            return state
    }
}

export default messages