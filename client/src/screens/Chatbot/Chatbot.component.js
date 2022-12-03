/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from "react";
import Messages from './Messages/Messages';
import InfoBar from './InfoBar/InfoBar';
import Input from './Input/Input';
import { getLoggedInUser, getTokens } from "../../helpers/authUtils";
import getSocket from "../../api/socket";

const ChatBotRobot = (props) => {
const  tokens = getTokens()
const user = getLoggedInUser()
const {setChatbot} = props;
 const [state, setState] = React.useState({
    messages: [],
    socket: getSocket(tokens?.access?.token),
    room: user?.id,
});
const [message, setMessage] = React.useState("");


useEffect(() => {
    state.socket.connect();
    state.socket.emit('joinChatbot', state.room);

    state.socket.on("sendMsgResponse", async (msg) => {
        state.messages.pop();
        setState({
            ...state,
            messages: [...state.messages]
        })
        sendMessage(msg);
    })
}, []);


const  onMessageWasSent = async (_message) => {
    setState({
        ...state,
        messages: [...state.messages, _message]
    })
    state.socket.emit('newChatbotMsg', { msg: _message.text})
}


const sendMessage = (text) => {
    if (text.length > 0) {
        const newMessage = {
            user: user?.username,
            text: text
        }
        setState({...state,
            messages: [...state.messages, newMessage]
        })
        onMessageWasSent(newMessage)
    }
}


    console.log('allmessages', state.messages)

        return (
            <div className="chatbot">
                <InfoBar room={"ChatBox"} setChatbot={setChatbot}/>
                <Messages messages={state.messages} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        );
}

export default ChatBotRobot;
