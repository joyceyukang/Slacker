const LOAD_REPLIES = 'replies/LOAD'
const CREATE_REPLIES = 'replies/CREATE'
const UPDATE_REPLIES = 'replies/UPDATE'
const DELETE_REPLIES = 'replies/DELETE'
const GET_ONE_REPLY = 'replies/GET_ONE'

const load = replies => ({
    type: LOAD_REPLIES,
    replies
})

const create = reply => ({
    type: CREATE_REPLIES,
    reply
})

const update = reply => ({
    type: UPDATE_REPLIES,
    reply
})


const getOne = reply => ({
    type: GET_ONE_REPLY,
    reply
})

const remove = replyId => ({
    type: DELETE_REPLIES,
    replyId
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

export const getAllMessageReplies = (messageId) => async dispatch => {
    const response = await fetch(`/api/replies/${messageId}/replies`)

    if(response.ok) {
        const allReplies = await response.json()
        dispatch(load(allReplies))
        return allReplies
    }
}

// Create a reply
export const createReply = (payload) => async dispatch => {
    const response = await fetch(`/api/replies/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    
    if (response.ok) {
        const newReply = await response.json();
        dispatch(create(newReply))
        return newReply
    }
}

// Update an exisiting reply
export const editReply = (replyId, payload) => async dispatch => {
    const response = await fetch(`/api/replies/${replyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })

    if(response.ok) {
        const updateReply = await response.json()
        dispatch(update(updateReply))
        return updateReply
    }
}

export const deleteReply = (replyId) => async dispatch => {
    const response = await fetch(`/api/replies/${replyId}`, {
        method: 'DELETE'
    })

    if(response.ok) {
        await response.json()
        dispatch(remove(replyId))
    }
}

const initialState = { allMessageReplies: {}, singleMessageReplies: {} }

const replies = (state = initialState, action) => {
    let newState;
    let newSingleMessageReplies;
    switch (action.type) {
        case LOAD_REPLIES:
            newState = { ...state };
            newState.allMessageReplies = {};
            action.replies.messageReplies.forEach(message => {
                newState.allMessageReplies[message.id] = message;
            })
            return newState;
        case CREATE_REPLIES:
            newState = { ...state };
            newSingleMessageReplies = action.reply
            newState.allMessageReplies[newSingleMessageReplies.id] = newSingleMessageReplies
            return newState;
        case GET_ONE_REPLY:
            newState = { ...state };
            newSingleMessageReplies = action.reply
            newState.singleMessageReplies = newSingleMessageReplies
            return newState;
        case UPDATE_REPLIES:
            // console.log("NEW STATE",newState)
            newSingleMessageReplies = action.reply
            newState = {
                allMessageReplies: {...state.allMessageReplies},
                singleMessageReplies: {...state.singleMessageReplies}
            };
            // console.log("NEW MESSAGE",newSingleChannelMessage)
            newState.allMessageReplies[newSingleMessageReplies.id] = newSingleMessageReplies;
            // console.log("NEW STATE AFTER UPDATING MESSAGE", newState)
            return newState;
        case DELETE_REPLIES:
            newState = {
                allMessageReplies: {...state.allMessageReplies},
                singleMessageReplies: {...state.singleMessageReplies}
            };
            delete newState.allMessageReplies[action.replyId]
            return newState;
        default:
            return state
    }
}

export default replies