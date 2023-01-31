/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef } from "react";
import Messages from './Messages/Messages';
import InfoBar from './InfoBar/InfoBar';
import {getLoggedInUser, getTokens} from "../../helpers/authUtils";
import {ROOM_MESSAGES_KEY} from "../../constants/queryKeys";
import {useInfiniteQuery} from "react-query";
import {deleteAllMessages, getMessages, sendMessage} from "../../api/messages";
import ChatInput from "../Dashboard/UserChat/Input";
import {ReactComponent as LoadingCircle} from '../../assets/images/loading_circle_icon.svg'
import getSocket from "../../api/socket";
import { ROOM_SOCKET } from "../../constants/socket.routes";

const ChatBotRobot = (props) => {
    const {room} = props
    const user = getLoggedInUser()
    const tokens = getTokens()
    const socket = getSocket(tokens?.access?.token)
    const observer = useRef()
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(ROOM_MESSAGES_KEY(room?.id), async ({pageParam}) => {
        const data = await getMessages(room?.id, pageParam)
        return data

    }, {
        getNextPageParam: (lastPage) => {
            const {page, totalPages} = lastPage
            return page < totalPages ? page + 1 : undefined
        }
    })

    useEffect(() => {
        //onmount send initial chatbot message
        init()
        return (() => {
            deleteAllMessages(room?.id)
            localStorage.setItem('typeUsage', 'DEFAULT')
        })
    }, [])

    const init = async () => {
        const data = new FormData()
        data.append('roomId', room.id)
        data.append('text', "Bonjour, je suis le chatbot de BikeKings, comment puis-je vous aider ? choisissez l'un des 1T,2T..STOP.\n\n1T - Entretien de la moto\n2T - Informations sur la moto\n3T - Nous Contacter\nSTOP - Stopper la conversation")
        data.append('isBotMessage', true)
        data.append('isChatbot', true)

        const result = await sendMessage(data)
        socket.emit(ROOM_SOCKET.ROOM_SEND_MESSAGE, {
            msg: result,
            receiverId: null ,
            isChatbot: true,
          })
    }

    const lastMessageRef = useCallback((node) => {
        if (isLoading)
            return
        if (observer.current)
            observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage()
                }
            })

        if (node)
            observer.current.observe(node)

    }, [isLoading, hasNextPage, fetchNextPage])

    
    let messages = data ? data.pages.flatMap((page) => page?.results ?? []) : []

   useEffect(() => {
    messages.forEach(async (message) => {
        if(message.message === "Merci pour votre visite, à bientôt !"){
          setTimeout(() => {
            props?.setChatbot(false)
          }, 4000)
        }
    })
   }, [messages])


  

    console.log('messages', messages)

    return (
        <div className="chatbot">
            <InfoBar room={"ChatBox"}
                setChatbot={props?.setChatbot}/>

          <Messages room={room} lastMessageRef={lastMessageRef}
                messages={messages}/> {
            isLoading || (isFetchingNextPage && messages.length) ? (
                <div className="flex self-end">
                    <LoadingCircle className='animate-spin mt-2 h-5 w-5 text-black mx-auto'/>
                </div>
            ) : null
        }
   
            <ChatInput room={
                    {id: room?.id}
                }
                user={user}
                isChatbot={true}
                />
        </div>
    );
}

export default ChatBotRobot;
