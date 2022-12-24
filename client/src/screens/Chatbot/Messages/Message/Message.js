import React , { useState, useEffect, useCallback } from 'react';
import './Message.css';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as ChatBotIconSvg } from "../../../../assets/images/chatbot.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { createRendezVousApi, getAllRendezVousPerType } from '../../../../api/rendezvous';
import { getTokens } from '../../../../helpers/authUtils';
import getSocket from '../../../../api/socket';
import { sendMessage } from '../../../../api/messages';
import { ROOM_SOCKET } from '../../../../constants/socket.routes';

const rendezVousListMatch = [
  "Veuillez Choisir une date pour le rendez-vous ?",
  "Nous vous proposons un essaie routier.\nVeuillez Choisir une date pour un essaie routier ?",
  "Nous vous proposons un essaie tout terrain.\nVeuillez Choisir une date  pour un essaie tout terrain ?",
  "Nous vous proposons un essai sur piste.\nVeuillez Choisir une date pour un essai sur piste ?",
]

const Message = ({ message, messages, index, room}) => {
  const tokens = getTokens()
  const socket = getSocket(tokens?.access?.token)
  const [startDate, setStartDate] = useState(new Date());
  const [allRendezVousPerType , setAllRendezVousPerType] = useState([])
  let isSentByCurrentUser = false;

  console.log('allRendezVousPerType', allRendezVousPerType)

const excludeDates  = useCallback(() => {
    return allRendezVousPerType?.reduce((acc, item) => {
      return  [...acc, moment(item.date).toDate()]
    }, [])
}, [allRendezVousPerType])

   useEffect(() => {
    const init = async () => {
      const type = localStorage.getItem('typeUsage')
      console.log('typeUsagebro', type)
      const data = await getAllRendezVousPerType(type || 'DEFAULT')
      setAllRendezVousPerType(data)
     }
     init()
   }, [])

  if(!message?.isBotMessage) {
    isSentByCurrentUser = true;

  }

  const showEntretienDatePicker =  () => {
    return messages?.length > 0 && (messages?.length - 1) === index  && messages[messages.length - 1].message === "Quel est la deniere date d'entretien de la moto ?"
  }
  const showRendezvousDatePicker =  () => {
    return messages?.length > 0 && (messages?.length - 1) === index  && rendezVousListMatch.includes(messages[messages.length - 1].message)
  }

  const onDateSelected = async (date) => {
    setStartDate(date);
    //save rendezvous date to db
    await createRendezVousApi(date)

    // create and send a message with this new date
    const data = new FormData()
    data.append('roomId', room.id)
    data.append('text', moment(date).format("DD/MM/YYYY"))
    data.append('isBotMessage', false)
    data.append('isChatbot', true)
    data.append('suffix', 'RDV')

    const result = await sendMessage(data)
    socket.emit(ROOM_SOCKET.ROOM_SEND_MESSAGE, {
        msg: result,
        receiverId: null ,
        isChatbot: true,
      })
  };

  const onEntretienDateSelected= async (date) => {
    setStartDate(date);
    // create and send a message with this new date
    const data = new FormData()
    data.append('roomId', room.id)
    data.append('text', moment(date).format("DD/MM/YYYY"))
    data.append('isBotMessage', false)
    data.append('isChatbot', true)
    data.append('suffix', 'DE')

    const result = await sendMessage(data)
    socket.emit(ROOM_SOCKET.ROOM_SEND_MESSAGE, {
        msg: result,
        receiverId: null ,
        isChatbot: true,
      })
  };

  const onDateChange = (date, e) => {
    if(e.key === 'Enter') {
      onDateSelected(date)
    }else{
      setStartDate(date);
    }
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <div className="messageBox  bg-primary">
            <p className="messageText text-white whitespace-pre-wrap">{message?.message}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
                  <SvgIcon >
              <ChatBotIconSvg />
            </SvgIcon>
            <div className="messageBox bg-gray-100">
              <p className="messageText text-black whitespace-pre-wrap">{message?.message}</p>
           {showEntretienDatePicker() &&  <DatePicker 
           name='entretienDate'
           className='text-black'
           dateFormat={"dd/MM/yyyy"}
           startDate={startDate} 
           selected={startDate} 
           onSelect={onEntretienDateSelected}
           />}
                 {showRendezvousDatePicker() &&  <DatePicker 
           name='rendezvousDate'
           className='text-black'
           dateFormat={"dd/MM/yyyy"}
           startDate={startDate} 
           selected={startDate} 
           onSelect={onDateSelected} 
           onChange={onDateChange}
           excludeDates={excludeDates()}
           />}
            </div>
          </div>
        )
  );
}

export default Message;