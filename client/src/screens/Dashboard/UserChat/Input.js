import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Row, Col, UncontrolledTooltip, ButtonDropdown, DropdownToggle, DropdownMenu, Label, Form } from "reactstrap";
import Picker from 'emoji-picker-react';
import { useQueryClient } from 'react-query';
import { getTokens } from '../../../helpers/authUtils';
import getSocket from '../../../api/socket';
import friendObject from '../../../helpers/friendObject';
import { ROOM_SOCKET } from '../../../constants/socket.routes';
import { sendMessage } from '../../../api/messages';
import { ROOM_MESSAGES_KEY } from '../../../constants/queryKeys';

const rendezvousType = {
  '1U': 'ROUTIER',
  '2U': 'TOUT_TERRAIN',
  '3U': 'SPORTIF',
};


function ChatInput(props) {
    const {room, user, isChatbot=false, isGroup = false} = props;
    const [text, setText] = useState("");
    const [isOpen, setisOpen] = useState(false);
    const tokens = getTokens()
    const [socket, setSocket] = useState(null)
    const [isTyping, setTyping] = useState(false)
    const inputRef = useRef(null)
    const cache = useQueryClient()
  
    const toggle = () => setisOpen(!isOpen);
  
    // connect to socket on component mount.
    useEffect(() => {
      const newSocket = getSocket(tokens?.access?.token)
      setSocket(newSocket)
    }, [setSocket, tokens?.access?.token])


    //function for text input value change
    const handleChange = e => {
      e.preventDefault()
      const chatText = e.target.value

      if (chatText.trim().length <= 3000) setText(chatText)

      if (chatText.trim().length === 1 && !isTyping) {
        setTyping(true)
        socket.emit('startTyping', room.id)
      } else if (chatText.length === 0) {
        setTyping(false)
        socket.emit('stopTyping', room.id)
      }


    }

    const onEmojiClick = (emojiObject) => {
      console.log('emojiObject', emojiObject)
    setText(text + emojiObject.emoji)
    };



    //function for send data to onaddMessage function(in userChat/index.js component)
    const onaddMessage = async (e) => {
      e.preventDefault()

        if (!text) return
        socket.emit('stopTyping', room.id)
        setTyping(false)
  
        const data = new FormData()
        data.append('roomId', room.id)
        data.append('text', text.trim())
        data.append('isGroup', isGroup)
        if(isChatbot){
          data.append('isChatbot', true)
          if(['1u', '1U', '2U', '2u', '3U', '3u'].includes(text.trim())){
            console.log('typeUsageSet', text.trim().toUpperCase(), rendezvousType[text.trim().toUpperCase()])
           localStorage.setItem('typeUsage', rendezvousType[text.trim().toUpperCase()])
          }
        }
  
        try {
          const result = await sendMessage(data)
          console.log('sendMessageResult', result, user)
          socket.emit(ROOM_SOCKET.ROOM_SEND_MESSAGE, {
            msg: result,
            receiverId: isChatbot ? null : friendObject(
              user,
              room,
              'sender.id',
              'sender',
              'receiver'
            ).id,
            isChatbot: isChatbot
          })
  
          setText('')
          inputRef?.current?.focus()
  
          // populate actual sender object
          result.senderId = user
  
         cache.setQueryData(ROOM_MESSAGES_KEY(room.id), (d) => {
            if (d?.pages[0]?.results[0]?.id !== result?.id) {
              d?.pages[0]?.results.unshift(result)
            }
            console.log('dhere', d)
            return d
          })
        } catch (e) {
          console.log('e: ', e)
          setText('')
        }
    }

    return (
        <React.Fragment>
            <div style={{position: 'absolute', bottom: 0, maxWidth: `calc(100vw - ${450}px)`}} className="w-full flex pl-2 py-2 border-top bg-white">
                <Form className='w-full'>
                    <Row className='w-full' >
                        <Col>
                            <div>
                                <Input type="text" value={text} onChange={(e) => handleChange(e)} className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." />
                            </div>
                        </Col>
                        <Col xs="auto">
                            <div className="chat-input-links ms-md-2">
                                <ul className="list-inline mb-0 ms-0">
                                  {!isChatbot &&  <li className="list-inline-item">
                                        <ButtonDropdown className="emoji-dropdown" direction="up" isOpen={isOpen} toggle={toggle}>
                                            <DropdownToggle id="emoji" color="link" className="text-decoration-none font-size-16 btn-lg waves-effect">
                                                <i className="text-2xl ri-emotion-happy-line"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <Picker onEmojiClick={onEmojiClick}  />
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                        <UncontrolledTooltip target="emoji" placement="top">
                                            Emoji
                                        </UncontrolledTooltip>
                                    </li>}
                                    <li className="list-inline-item">
                                        <Button onClick={onaddMessage}  color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                                            <i className="ri-send-plane-2-fill"></i>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </React.Fragment>
    );
}

export default ChatInput;
