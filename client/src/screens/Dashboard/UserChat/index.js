import React, {useCallback, useEffect, useRef, useState} from 'react';

// actions
import UserHead from './UserHead';
import {getTimeDifference, isNewDay} from '../../../helpers/dateUtils';
import {ROOM_MESSAGES_KEY} from '../../../constants/queryKeys';
import {useInfiniteQuery} from 'react-query';
import {getMessages} from '../../../api/messages/index';
import EmptyChat from './EmptyChat'
import Input from './Input'
import Message from './Message'
import Divider from './Divider'
import {ReactComponent as LoadingCircle} from '../../../assets/images/loading_circle_icon.svg'
import useMessageSocket from '../../../api/socket/useMessageSocket';

function checkSameTime(message1, message2) {
    if (message1.senderId.id !== message2.senderId.id) 
        return false
    if (message1.createdAt === message2.createdAt) 
        return false
    return getTimeDifference(message1.createdAt, message2.createdAt) < 5
}

function UserChat(props) {
    const {currentChat} = props;
    const {room, user} = currentChat || {};
    const observer = useRef()
    const [currentMsgEditId, setCurrentMsgEditId] = useState(null)
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(ROOM_MESSAGES_KEY(room?.id), async ({pageParam}) => {
        console.log('roomId0', room)
        const data = await getMessages(room?.id, pageParam)
        console.log('roomId01', room?.id, data)
        return data

    }, {
        getNextPageParam: (lastPage) => {
            const {page, totalPages} = lastPage
            return page < totalPages ? page + 1 : undefined
        }
    })

    useMessageSocket(room?.id, ROOM_MESSAGES_KEY(room?.id))

    console.log("infodata", currentChat?.room, data, isLoading, hasNextPage, isFetchingNextPage)



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

    const setEditMessage = (msgId) => {
        setCurrentMsgEditId(msgId)
    }

    return (
        <React.Fragment>
            <div className="user-chat w-100">

                <div className="flex flex-col">

                    <div className={
                        props.userSidebar ? "w-70" : "w-100"
                    }>


                        <UserHead currentChat={currentChat} />

                        <div style={
                                {height: "calc(100vh - 200px)",flexDirection: "column", justifyContent: "flex-end", overflowY: "auto", overflowX: "hidden"}
                            }
                            className=" w-full p-3 p-lg-4"
                            id="messages">

                            <div  className="flex flex-col justify-end mb-0 ">

                                {
                                isLoading === false && messages.length ? (messages.reverse().map((message, index) => {
                                    if (messages.length === index + 1) {
                                        return (
                                            <div key={
                                                `${
                                                    message.id
                                                }-${index}`
                                            }>
                                                <div 
                                                    ref={lastMessageRef}>
                                                    <Message isSameTime={
                                                            checkSameTime(message, messages[Math.min(index + 1, messages.length - 1)])
                                                        }
                                                        chat={message}
                                                        currentMsgEditId={currentMsgEditId}
                                                        setEditMessage={setEditMessage}/>
                                                </div>
                                                {
                                                isNewDay(message.createdAt, messages[Math.min(index + 1, messages.length - 1)].createdAt) && <Divider date={
                                                    message.createdAt
                                                }/>
                                            } </div>
                                        )
                                    }

                                    return (
                                        <div  key={
                                            `${
                                                message.id
                                            }-${index}`
                                        }>
                                            <Message 
                                                isSameTimePrev={
                                                    checkSameTime(message, messages[Math.min(index + 1, messages.length - 1)])
                                                }
                                                isSameTimeNext={
                                                    checkSameTime(message, messages[index - 1 < 0 ? 0 : index - 1])
                                                }
                                                chat={message}
                                                currentMsgEditId={currentMsgEditId}
                                                setEditMessage={setEditMessage}/> {
                                            isNewDay(message.createdAt, messages[Math.min(index + 1, messages.length - 1)].createdAt) && <Divider date={
                                                message.createdAt
                                            }/>
                                        } </div>
                                    )
                                })) : (
                                    <EmptyChat room={room}
                                        user={user}/>
                                )
                            }
                                {
                                isLoading || (isFetchingNextPage && messages.length) ? (
                                    <p>
                                        <LoadingCircle className='animate-spin mt-2 h-5 w-5 text-black mx-auto'/>
                                    </p>
                                ) : null
                            }
                            </div>
                        </div>

                        <Input room={room}
                            user={user}/>

                    </div>


                </div>
            </div>

        </React.Fragment>


    );
}


export default UserChat;