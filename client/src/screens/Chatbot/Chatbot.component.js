/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from "react";
import Messages from './Messages/Messages';
import InfoBar from './InfoBar/InfoBar';
import Input from './Input/Input';
import { getLoggedInUser, getTokens } from "../../helpers/authUtils";
import getSocket from "../../api/socket";
import { ROOM_SOCKET } from "../../constants/socket.routes";

const ChatBotRobot = (props) => {
const  tokens = getTokens()
const user = getLoggedInUser()
const {setChatbot} = props;
 const [state, setState] = React.useState({
    messages: [],
    socket: null,
    room: '',
});
const [message, setMessage] = React.useState("");


const handleMessageFromBot = useCallback((msg) => {
    console.log("sendMsgResponse", msg)
    state.messages.pop();
    setState({
        ...state,
        messages: [...state.messages, msg]
    })
  }, []);

    useEffect(() => {
        const newSocket = getSocket(tokens?.access?.token)
            const roomId = `chatbot-${user?.id}`
            setState({...state, socket: newSocket,  room: roomId})
            newSocket.connect();
            newSocket.emit(ROOM_SOCKET.JOIN_ROOM, { roomId: roomId, userId: user?.id });
        
            newSocket.on("sendMsgResponse", handleMessageFromBot);

            return () => {
               if(newSocket){
                newSocket.disconnect()
                newSocket.off("sendMsgResponse", handleMessageFromBot)
               }
            }
       
    }, [tokens?.access?.token,  user?.id, handleMessageFromBot])


const sendMessage = useCallback((e) => {
    e.preventDefault()

    if (message.length > 0) {
        const newMessage = {
            user: user?.username,
            text: message
        }
        setState({...state,
            messages: [...state.messages, newMessage]
        })
        state.socket.emit(ROOM_SOCKET.ROOM_SEND_MESSAGE, { msg: message, isChatbot: true})
        setMessage("")
    }
}, [message, state.socket])


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
