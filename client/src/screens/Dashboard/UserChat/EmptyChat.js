import React from 'react'
import Lottie from 'react-lottie'
import animationData from '../../../assets/lottie/start-chatting.json'
import { friendObject } from '../../../hooks/actions'

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
}

export default function EmptyChat({room, user}) {
    let userName
    if (room && user) {
        if(room.groupName){
            userName = room.groupName
        }else{
            userName = friendObject(user, room, 'sender.id', 'sender', 'receiver').username
        }

    }

    return (
        <div className='flex self-end flex-1 flex flex-col justify-end p-4 w-full h-full'>
            <div className='flex flex-col justify-start items-start'>
               <div>
               <Lottie className='text-left flex justify-start'
                    options={defaultOptions}
                    height={150}
                    width={150}/>
               </div>
                <div>
                    <p className='w-full text-black'>
                        Write to {userName} {' '}
                        to start a conversation.
                    </p>
                </div>
            </div>
        </div>
    )
}
