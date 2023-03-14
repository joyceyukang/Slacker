import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { createReply, deleteReply, editReply, getAllMessageReplies } from "../../store/replies";
import { io } from 'socket.io-client';
import './Chat.css'
let socket;

const Replies = ({ messageId }) => {
    const [input, setInput] = useState("");
    const [editContent, setEditContent] = useState([]);
    const [editInputId, setEditInputId] = useState("");
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const previousReplies = Object.values(useSelector((state) => state.replies.allMessageReplies));
    const allChannels = Object.values(useSelector(state => state.channel.allChannels));
    const mainMessage = useSelector(state => state.messages.allChannelMessages[messageId]);
    let currentMessage = []
    let roomId
    let channel_id
    if (mainMessage) {
        currentMessage.push(mainMessage)
        roomId = parseInt(currentMessage[0].id) + parseInt(allChannels.length)
        channel_id = roomId
    } else {

    }
    let message_id = messageId
    let owner_id = user.id;

    // console.log(mainMessage.id)
    // console.log(allChannels.length)
    // console.log(roomId)

    useEffect(() => {
        socket = io();

        socket.emit("join", channel_id)

        socket.on("chat", (chat) => {
            dispatch(getAllMessageReplies(messageId))
        })

        return (() => {
            socket.emit("leave", channel_id)
            socket.disconnect()
        })
    }, [messageId, dispatch])

    // sending message content
    const updateInput = (e) => {
        setInput(e.target.value)
    };

    //live sending
    const sendChat = async (e) => {
        e.preventDefault()

        if (!input) return null;

        await socket.emit("chat", { user: user.username, msg: input, channel_id: roomId });
        let message_id = messageId

        const payload = {
            owner_id,
            message_id,
            input
        }

        await dispatch(createReply(payload))

        setInput("")
    }

    //edit message live
    //change messageId
    const editChat = (messageId, input) => {
        const payload = {
            owner_id,
            message_id,
            input
        }

        dispatch(editReply(messageId, payload))

        // console.log("EMIT CHAT")
        socket.emit("chat", { channel_id })
    }

    //delete message live
    //change message id
    const deleteChat = (messageId) => {
        dispatch(deleteReply(messageId))

        // console.log("EMIT CHAT")
        socket.emit("chat", { channel_id })
    }

    if (!user) <Redirect to="/login" />
    if (!allChannels || !mainMessage) {
        return null
    }

    return (
        <div className="everything-container">
            <div className="mc-container">
                <div className="semc-outer-container-2">
                    <div className="mm">
                        <div className="user-icon">
                            <i className="fa-sharp fa-solid fa-user user-guy"></i>
                        </div>
                        <div className="unmc">
                            <span className="un">
                                {mainMessage.user.username}
                            </span>
                            <span className="mcontent">
                                {mainMessage.input}
                            </span>
                        </div>
                    </div>
                    <div className="semc-mid-container">
                        <div className="semc-inner-container">
                            {previousReplies.map((message) =>
                                message.message_id === mainMessage.id && (
                                    <div className="single-m-container">
                                        {editInputId === message.id ?
                                            <div className='unmcedb-edit-container'>
                                                <div className="user-icon">
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
                                            <div className="unmcedb-container">
                                                <div className="umc-container">
                                                    <div className="user-icon">
                                                        <i className="fa-sharp fa-solid fa-user user-guy"></i>
                                                    </div>
                                                    <div className="unmc">
                                                        <span className="un">
                                                            {message.user.username}
                                                        </span>
                                                        <span className="mcontent">
                                                            {message.input}
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
        </div>
    )
};

export default Replies