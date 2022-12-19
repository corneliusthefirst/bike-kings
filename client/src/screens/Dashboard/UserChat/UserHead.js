import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Input, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { openUserSidebar } from "../../../redux/index";
import { friendObject } from '../../../hooks/actions';
import { isAdmin } from '../../../helpers/authUtils';
import { closeDMRoom } from '../../../api/room';
import { closeGroupApi } from '../../../api/group';


function UserHead(props) {
   const currentChat =  props.currentChat || props.defaultChat;
   const getInfo = useCallback(() => {
    return currentChat?.room.groupName ? {username: currentChat?.room.groupName }: (currentChat?.room  &&  currentChat?.user && friendObject(currentChat?.user, currentChat?.room)) || {}
    }, [currentChat])
    const [state, setState] = useState({
        room: currentChat?.room || "",
        user: currentChat?.user || {},
        opponent:  getInfo(),
    });

    const updateState = (obj) => {
        setState((prev) => ({ ...prev, ...obj }));
    }

    useEffect(() => {
        updateState({ room: currentChat?.room, user: currentChat?.user,   opponent:  getInfo()})
    }, [currentChat, getInfo]);

    console.log("currentChat", currentChat)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);

    const toggle = () => setDropdownOpen(!dropdownOpen);
    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);

    const openUserSidebar = (e) => {
        e.preventDefault();
        props.openUserSidebar();
    }

    function closeUserChat(e) {
        e.preventDefault();
        var userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.remove("user-chat-show");
        }
    }

    async  function deleteRoom() {
      if(state.room?.groupName && state.room.groupName.length > 0 && state.room.members.length > 0){
            const data = await closeGroupApi(state.room.id);
            console.log("dataDeletedGroup", data)
            if(data){
                props?.setCurrentChat({...currentChat, room: data})
            }
      }else{
        const data = await closeDMRoom(state.room.id);
        console.log("dataDeleted", data)
        if(data){
            props?.setCurrentChat({...currentChat, room: data})
        }
      }
    }

    const showDeleteOption = () => {
        if (state.room.groupName) {
            return isAdmin();
        }
        return true;
    }

    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-bottom">
                <Row className="align-items-center">
                    <Col sm={4} xs={8}>
                        <div className="d-flex align-items-center">
                            <div className="d-block d-lg-none me-2 ms-0">
                                <Link to="#" onClick={(e) => closeUserChat(e)} className="user-chat-remove text-muted font-size-16 p-2">
                                    <i className="ri-arrow-left-s-line"></i></Link>
                            </div>
                            {
                                <div className="chat-user-img align-self-center me-3">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                {state.opponent?.username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                            }

                            <div className="flex-grow-1 overflow-hidden">
                                <h5 className="font-size-16 mb-0 text-truncate">
                                    <Link to="#" onClick={(e) => openUserSidebar(e)} className="text-reset user-profile-show">
                                        {state.opponent?.username}
                                    </Link>

                                </h5>
                            </div>
                        </div>
                    </Col>
                    <Col sm={8} xs={4} >
                        <ul className="list-inline user-chat-nav text-end mb-0">

                            <li className="list-inline-item">
                                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                    <DropdownToggle color="none" className="btn nav-btn " type="button">
                                        <i className="ri-search-line"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-md">
                                        <div className="search-box p-2">
                                            <Input type="text" className="form-control bg-light border-0" placeholder="Search.." />
                                        </div>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>

                        {showDeleteOption() && <li className="list-inline-item">
                                <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                                    <DropdownToggle className="btn nav-btn " color="none" type="button" >
                                        <i className="ri-more-fill"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end bg-white">
                                        <DropdownItem className="d-block d-lg-none user-profile-show" onClick={(e) => openUserSidebar(e)}>View profile <i className="ri-user-2-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem onClick={(e) => deleteRoom(e)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>}

                        </ul>
                    </Col>
                </Row>
            </div>

        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const { users, active_user, currentChat: defaultChat } = state.Chat;
    return { ...state.Layout, users, active_user, defaultChat};
};

export default connect(mapStateToProps, { openUserSidebar})(UserHead);