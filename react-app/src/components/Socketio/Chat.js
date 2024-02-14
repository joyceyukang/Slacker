import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { io } from 'socket.io-client';
import { createMessage, getAllChannelMessages, deleteMessage, editMessage } from "../../store/messages";
import { getAllMessageReplies } from "../../store/replies";
import Replies from "./Replies"
import './Chat.css'
let socket;

const Chat = ({ channelId }) => {
    const [input, setInput] = useState("");
    const [editContent, setEditContent] = useState([]);
    const [editInputId, setEditInputId] = useState("");
    const [reply, setReply] = useState(false)
    const [replyId, setReplyId] = useState("")
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch();

    const previousMessage = useSelector((state) => state.messages.allChannelMessages)
    const previousMessageVal = Object.values(previousMessage)
    const channel = useSelector((state) => state.channel.singleChannel)

    //These are for the payload
    let owner_id = user.id;
    let channel_id = channel.id;

    // Use effect creates a websocket connection
    // Joins a channel through the join eventlistener
    useEffect(() => {
        // open socket connection
        // create websocket
        socket = io();

        socket.emit("join", channel_id)

        socket.on("chat", (chat) => {
            dispatch(getAllChannelMessages(channelId))
        })

        dispatch(getAllChannelMessages(channelId))

        // when component unmounts, disconnect
        return (() => {

            socket.emit("leave", channel_id)
            socket.disconnect()
        })
    }, [channel_id, dispatch])

    // sending message content
    const updateInput = (e) => {
        setInput(e.target.value)
    };

    //live sending
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

    //edit message live
    const editChat = (messageId, input) => {
        const payload = {
            owner_id,
            channel_id,
            input
        }
        dispatch(editMessage(messageId, payload))

        // console.log("EMIT CHAT")
        socket.emit("chat", { channel_id })
    }

    //delete message live
    const deleteChat = (messageId) => {
        dispatch(deleteMessage(messageId))

        // console.log("EMIT CHAT")
        socket.emit("chat", { channel_id })
    }

    const replyThread = async (messageId) => {
        if (messageId) {
            dispatch(getAllMessageReplies(messageId)).then(
                setReplyId(messageId)
            ).then(
                setReply(true)
            )
        }
        else {
            setReply(true)
        }
    }

    if (!user) <Redirect to="/login" />

    return (user && (
        <div className="everything-container">
            <div className="mc-container">
                <div className="semc-outer-container">
                    <div className="semc-mid-container">
                        <div className="semc-inner-container">
                            {previousMessageVal.map((message, id) =>
                                message.channel_id === channel.id && (
                                    <div className="single-m-container">
                                        {editInputId === message.id ?
                                            <div key="unmcedb-edit-container" className='unmcedb-edit-container'>
                                                <div key="icon-guy" className="user-icon">
                                                    <i className="fa-sharp fa-solid fa-user user-guy"></i>
                                                </div>
                                                <form
                                                    className="emc-form"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();

                                                        editChat(message.id, editContent)
                                                        setEditInputId("")
                                                    }
                                                    }>
                                                    <input
                                                        className="input-edit-message"
                                                        value={editContent}
                                                        onChange={(e) =>
                                                            setEditContent(e.target.value)
                                                        }
                                                        required
                                                        maxLength="2000"
                                                    />
                                                    <button className="scif-submit-button" type="submit">
                                                        <i className="fa-regular fa-circle-right"></i>
                                                    </button>
                                                </form>
                                            </div>
                                            :
                                            <div
                                                key="unmcedb-container" className="unmcedb-container">
                                                <div key="umc-container" className="umc-container">
                                                    <div key="icon-user-guy" className="user-icon">
                                                        <i className="fa-sharp fa-solid fa-user user-guy"></i>
                                                    </div>
                                                    <div className="unmc" key="tbody">
                                                        <span className="un">
                                                            {message.user.username}
                                                        </span>
                                                        <span className="mcontent">
                                                            {message.input}
                                                        </span>
                                                        <span className="rt-button">
                                                            {message.replies.length ?
                                                                <button onClick={() => {
                                                                    replyThread(message.id)
                                                                }}>
                                                                    {message.replies.length} replies
                                                                </button> :
                                                                <button onClick={() => {
                                                                    replyThread(message.id)
                                                                }}>
                                                                    reply
                                                                </button>
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
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
                                                ) : <div className="iedb-container"></div>}
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
                            <p className="message-length">Maximum character length 2000</p>
                            <div className="input-button-form">
                                <input
                                    maxLength="2000"
                                    className="input-message"
                                    value={input}
                                    onChange={updateInput}
                                    required
                                />
                                <button className="scif-submit-button" type="submit">
                                    <i className="fa-regular fa-circle-right"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="main-ri-container">
                {reply ?
                    <div className="r-container">
                        <div className="mm-outer">
                            <h3>Thread</h3>
                            <button onClick={() => {
                                setReply(false)
                            }}>X</button>
                        </div>
                        <Replies key="reply-key" messageId={replyId} />
                    </div>
                    :
                    null
                }
            </div>
        </div>
    )
    )
};


export default Chat;