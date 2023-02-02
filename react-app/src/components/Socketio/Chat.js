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

    const previousMessage = useSelector((state) => state.messages.allChannelMessages)
    const previousMessageVal = Object.values(previousMessage)
    const channel = useSelector((state) => state.channel.singleChannel)

    //These are for the payload
    let owner_id = user.id;
    let channel_id = channel.id;
    
    // Use effect creates a websocket connection
    // Joins a channel through the join eventlistener
    useEffect(() => {
        
        console.log('in the use effect')
        // open socket connection
        // create websocket
        socket = io();
        
        socket.emit("join", channel_id)
        
        socket.on("chat", (chat) => {
            dispatch(getAllChannelMessages(channel_id))
        })
        
        dispatch(getAllChannelMessages(channel_id))
        // when component unmounts, disconnect
        return (() => {

            socket.emit("leave", channel_id)
            socket.disconnect()
        })
    }, [channel_id, dispatch])

    const updateInput = (e) => {
        setInput(e.target.value)
    };


    const sendChat = async (e) => {
        e.preventDefault()

        if (!input) return null;


        await socket.emit("chat", { user: user.username, msg: input, channel_id: channel_id });

        const payload = {
            owner_id,
            channel_id,
            input
        }

        await dispatch(createMessage(payload))

        setInput("")
    }

    const editChat = (messageId, input) => {
        const payload = {
            owner_id,
            channel_id,
            input
        }
        dispatch(editMessage(messageId, payload))

        console.log("EMIT CHAT")
        socket.emit("chat", { channel_id })
    }

    const deleteChat = (messageId) => {
        dispatch(deleteMessage(messageId))

        console.log("EMIT CHAT")
        socket.emit("chat", { channel_id })
    }

    return (user && (
        <div className="mc-container">
            <div className="semc-outer-container">
                <div className="semc-mid-container">
                    <div className="semc-inner-container">
                        {previousMessageVal.map((message, id) =>
                            message.channel_id === channel.id && (
                                <div className="message-container">
                                    {editInputId === message.id ?
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();

                                                editChat(message.id, editContent)
                                                setEditInputId("")
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
                                        </form>
                                        :
                                        <div className="unmcedb-container">
                                            <i className="fa-sharp fa-solid fa-user user-guy"></i>
                                            <div className="unmc" key={id}>
                                                <span className="un">
                                                    {message.user.username}
                                                </span>
                                                <span className="mc">
                                                    {message.input}
                                                </span>
                                            </div>
                                            <div className="edb-container">
                                                {user.id === message.owner_id ? (
                                                    <div className="iedb-container">
                                                        <button className="edbe" onClick={() => {
                                                            setEditInputId(message.id)
                                                            setEditContent(message.input)
                                                        }
                                                        }>
                                                            <i className="fa-solid fa-pen-to-square" />
                                                        </button>
                                                        <button className="edbd" onClick={() => {
                                                            deleteChat(message.id)
                                                        }}>
                                                            <i className="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className="scif-container">
                <div className="scif-inner-container">
                    <form className="scif-form" onSubmit={sendChat}>
                        <input
                            className="input-message"
                            value={input}
                            onChange={updateInput}
                            required
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>

    )
    )
};


export default Chat;