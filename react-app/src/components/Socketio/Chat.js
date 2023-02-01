import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { createMessage, getAllChannelMessages, deleteMessage, editMessage } from "../../store/messages";
import './Chat.css'
let socket;

const Chat = ({ channelId }) => {
    const [input, setInput] = useState("");
    const [editContent, setEditContent] = useState([]);
    const [editInputId, setEditInputId] = useState("");
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()

    //These are for the payload
    let owner_id = user.id;


    const previousMessage = useSelector((state) => state.messages.allChannelMessages)
    const previousMessageVal = Object.values(previousMessage)
    const channel = useSelector((state) => state.channel.singleChannel)
    let channel_id = channel.id;

    console.log(channel.id)
    console.log('HELLO', previousMessageVal)


    // Use effect creates a websocket connection
    // Joins a channel through the join eventlistener
    useEffect(() => {

        console.log('in the use effect')
        // open socket connection
        // create websocket
        socket = io();

        socket.emit("join", channelId)

        socket.on("chat", (chat) => {
            // seteditContent(editContent => [...editContent, chat])
        })
        console.log('hi im here before the dispatch')
        dispatch(getAllChannelMessages(channelId))

        // when component unmounts, disconnect
        return (() => {

            socket.emit("leave", channelId)
            socket.disconnect()
        })
    }, [channel_id, dispatch])

    const updateInput = (e) => {
        setInput(e.target.value)
    };


    const sendChat = async (e) => {
        e.preventDefault()
        if (!input) return null;

        await socket.emit("chat", { user: user.username, msg: input, channelId });

        const payload = {
            owner_id,
            channel_id,
            input
        }

        await dispatch(createMessage(payload))

        setInput("")
    }

    const editHandler = (messageId, input) => {
        const payload = {
            owner_id,
            channel_id,
            input
        }
        console.log(messageId)
        console.log(payload)
        dispatch(editMessage(messageId, payload))
        socket.emit("chat", { channelId })
    }

    const deleteHandler = (messageId) => {
        dispatch(deleteMessage(messageId))
        socket.emit("chat", { channelId })
    }

    return (user && (
        <div className="chat-container">
            <div className="editContent-sent">
                {previousMessageVal.map((message, id) =>
                    message.channel_id === channel.id &&
                    (
                        <div>
                            {editInputId === message.id ?
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        editHandler(message.id, editContent)
                                        setEditInputId(false)
                                    }
                                    }>
                                    <input
                                        className="input-message"
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                          }
                                        required
                                    />
                                    <button type="submit">Edit</button>
                                </form> :

                                <div key={id}>{`${message.owner_id}: ${message.input}`}</div>
                            }
                            <div>
                                {user.id === message.owner_id && (
                                    <div>
                                        <button onClick={() => {
                                            setEditInputId(message.id)
                                            setEditContent(message.input)
                                        }
                                        }>
                                            Edit
                                        </button>
                                        <button onClick={() => {
                                            deleteHandler(message.id)
                                        }}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
            <form onSubmit={sendChat}>
                <input
                    className="input-message"
                    value={input}
                    onChange={updateInput}
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
    )
};


export default Chat;