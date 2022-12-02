import React, { useEffect } from 'react';
import { Input, InputGroup } from "reactstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import classnames from 'classnames'
import { GetOpenRooms } from '../../../hooks/reactQuery';
import { getLoggedInUser } from '../../../helpers/authUtils';
import { friendObject } from '../../../hooks/actions';
import moment from 'moment';
import { connect } from 'react-redux';
import {setStoreCurrentChat} from '../../../redux/index'


const Chats = (props) => {
    const {setCurrentChat, currentChat} = props;
    const user  = getLoggedInUser()
    const { data: rooms } = GetOpenRooms()
    const [searchChat, setSearchChat] = React.useState("");
    const [conversation, setConversation] = React.useState(rooms);


    console.log(rooms, user)

    useEffect(() => {
        setConversation(rooms)
        if(rooms?.length && !currentChat){
            setCurrentChat({room: rooms[0], user: user})
        }
    }, [rooms, setCurrentChat, user, currentChat, props])

    const   handleChange = (e) => {
        setSearchChat(e.target.value);
        var search = e.target.value;
        let conversation = rooms;
        let filteredArray = [];

        //find conversation name from array
        conversation.forEach((item) => {
           const opponent = friendObject(user, item)
            if (opponent.username.toLowerCase().includes(search.toLowerCase())) {
                filteredArray.push(item);
           }
        });

        //set filtered items to state
        setConversation(filteredArray)

        //if input value is blanck then assign whole recent chatlist to array
        if (search === "")         setConversation(rooms)
    }

    const openUserChat = (room) => {
        setCurrentChat({room: room, user: user})
        props.setStoreCurrentChat({room: room, user: user})
    }

    return (
        <React.Fragment>
        <div>
            <div className="px-4 pt-4">
                <h4 className="mb-4">Chats</h4>
                <div className="search-box chat-search-box">
                    <InputGroup size="lg" className="mb-3 rounded-lg">
                        <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                            <i className="ri-search-line search-icon font-size-18"></i>
                        </span>
                        <Input type="text" value={searchChat} onChange={(e) => handleChange(e)} className="form-control bg-light" placeholder="Search messages or users" />
                    </InputGroup>
                </div>
            </div>
            <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">

<ul className="list-unstyled chat-list chat-user-list pr-3" id="chat-list">
    {
        conversation?.map((item, key) =>
        {
            const chat = friendObject(user, item)

            return chat && (
            <li key={key} id={"conversation" + key} className={classnames({ 'bg-light': currentChat.room.id === item.id})} >
            <Link to="#" onClick={() => openUserChat(item)}>
                <div className="d-flex">
                    {
                            <div className={"chat-user-img " + chat?.status + " align-self-center me-3 ms-0"}>
                                <div className="avatar-xs">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {chat?.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {
                                    chat?.status && <span className="user-status"></span>
                                }
                            </div>
                    }

                    <div className="w-full flex flex-row items-center justify-between overflow-hidden">
                        <h5 className="text-truncate font-size-15 mb-1">{chat?.username}</h5>
                        <div className="font-size-11">{moment(chat.updatedAt).format("DD/MM/YYYY")}</div>
                    </div>
                </div>
            </Link>
        </li>)
        }
        )
    }
</ul>
</SimpleBar>
            </div>
        </React.Fragment>
    )
  }



export default connect(null, {setStoreCurrentChat})(Chats)
