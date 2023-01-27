const LOAD_CHANNELS = 'channels/LOAD'
const CREATE_CHANNEL = 'channels/CREATE'
const UPDATE_CHANNEL = 'channels/UPDATE'
const DELETE_CHANNEL = 'channels/DELETE'
const GET_ONE_CHANNEL = 'channels/GET_ONE'

const load = channels => ({
    type: LOAD_CHANNELS,
    channels
})

const create = channel => ({
    type: CREATE_CHANNEL,
    channel
})

const update = channel => ({
    type: UPDATE_CHANNEL,
    channel
})


const getOne = channel => ({
    type: GET_ONE_CHANNEL,
    channel
})

const remove = channelId => ({
    type: DELETE_CHANNEL,
    channelId
})

// Get a single channel
export const getOneChannel = (id) => async dispatch => {
    const response = await fetch(`/api/channels/${id}`);
    if (response.ok){
        const channels = await response.json()
        dispatch(getOne(channels))
        return channels
    }
}

// Get all existing channels
export const getAllChannels = () => async dispatch => {
    const response = await fetch('/api/channels/')

    if (response.ok) {
        const channels = await response.json();
        dispatch(load(channels))
        return channels;
    }
}

// Create a channel
export const createChannel = (channel) => async dispatch => {
    const response = await fetch('/api/channels/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channel)
    })
    
    if (response.ok) {
        const newChannel = await response.json();
        dispatch(create(newChannel))
        return newChannel
    }
}

// Update an exisiting channel
export const editChannel = (channel, id) => async dispatch => {
    const response = await fetch(`/api/channels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channel)
    })

    if(response.ok) {
        const updateChannel = await response.json()
        dispatch(update(updateChannel))
        return updateChannel
    }
}

export const deleteChannel = (id) => async dispatch => {
    const response = await fetch(`/api/channels/${id}`, {
        method: 'DELETE'
    })

    if(response.ok) {
        await response.json()
        dispatch(remove(id))
    }
}

const initialState = { allChannels: {}, singleChannel: {} }

const channel = (state = initialState, action) => {
    let newState;
    let newAllChannels;
    let newSingleChannel;
    switch (action.type) {
        case LOAD_CHANNELS:
            newState = { ...state };
            newAllChannels = {...state.allChannels}
            action.channels.channels.forEach(channel => {
                newAllChannels[channel.id] = channel;
            })
            newState.allChannels = newAllChannels;
            return newState;
        case CREATE_CHANNEL:
            newState = { ...state };
            newSingleChannel = action.channel
            newState.allChannels[newSingleChannel.id] = newSingleChannel
            return newState;
        case GET_ONE_CHANNEL:
            newState = { ...state };
            newSingleChannel = action.channel
            newState.singleChannel = newSingleChannel
            return newState;
        case UPDATE_CHANNEL:
            newState = {...state};
            newSingleChannel = action.channel
            newState.allChannels[newSingleChannel.id] = newSingleChannel;
            return newState;
        case DELETE_CHANNEL:
            newState = {...state};
            newAllChannels = {...state.allChannels};
            delete newAllChannels[action.channelId]
            newState.allChannels = newAllChannels;
            return newState;
        default:
            return state
    }
}

export default channel