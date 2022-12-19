/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef } from "react";
import Messages from './Messages/Messages';
import InfoBar from './InfoBar/InfoBar';
import {getLoggedInUser} from "../../helpers/authUtils";
import {ROOM_MESSAGES_KEY} from "../../constants/queryKeys";
import {useInfiniteQuery} from "react-query";
import {deleteAllMessages, getMessages} from "../../api/messages";
import ChatInput from "../Dashboard/UserChat/Input";
import {ReactComponent as LoadingCircle} from '../../assets/images/loading_circle_icon.svg'

const ChatBotRobot = (props) => {
    const {room} = props
    const user = getLoggedInUser()
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
        return (() => {
            deleteAllMessages(room?.id)
        })
    }, [data])

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


    const messages = data ? data.pages.flatMap((page) => page?.results ?? []) : []

    console.log('messages', messages)

    return (
        <div className="chatbot">
            <InfoBar room={"ChatBox"}
                setChatbot={props?.setChatbot}/>

          <Messages lastMessageRef={lastMessageRef}
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
                isChatbot={true}/>
        </div>
    );
}

export default ChatBotRobot;
