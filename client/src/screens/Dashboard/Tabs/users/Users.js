import React, { useState } from 'react';
import { useEffect } from 'react';
import { Input, InputGroup, UncontrolledTooltip } from 'reactstrap';
import { getLoggedInUser } from '../../../../helpers/authUtils';
import { GetAllUsers } from '../../../../hooks/reactQuery';
import SimpleBar from "simplebar-react";
import { useQueryClient } from 'react-query';
import { getOpenRoomsApi, getOrCreateRoom } from '../../../../api/room';
import { OPEN_ROOMS } from '../../../../constants/queryKeys';
import { connect } from 'react-redux';
import {setActiveTab, setStoreCurrentChat} from '../../../../redux/index';
import { sendFriendRequest } from '../../../../api/friend';
import ReactGA from 'react-ga'

const UserItem = (props) => {
    const {item, user} = props
    const [isLoading, setIsLoading] = useState(false)
    const cache = useQueryClient()

    async function openConversation(e) {
        setIsLoading(true)
        try {
            const data = await getOrCreateRoom(item.id)
            if (data) {
              cache.invalidateQueries(OPEN_ROOMS)
              const rooms = await getOpenRoomsApi()
              const currentroom = rooms.find((room) => room.id === data.id)
              setIsLoading(false)
              console.log("currentdataroom", currentroom)
              props.setActiveTab('chat')
              props.setCurrentChat({room: currentroom , user: user})
              props.setStoreCurrentChat({room: currentroom, user: user})
    
            } else {
              setIsLoading(false)
            }
          } catch (err) {
            console.log('dataroomerr', err)
            setIsLoading(false)
          }
      }

      const sendCommunicationRequest = async (e) => {
        e.preventDefault()
      try{
        const {username, shortId, status} = item
      if(status === 'AVAILABLE' && username && shortId) {
        const result = await sendFriendRequest({ username: username, shortId: shortId })
        console.log("result", result)
        ReactGA.event({
            category: 'Communication Request',
            action: 'Send Communication Request',
          })
      }else{
        alert('This advisor is not available for communication')
      }
      }catch(err){
        console.log("err", err)
        }
    }
    
    return (
    
       
        <div className="d-flex px-4 pb-4">
            {
                    <div className={"item-user-img " + item?.status + " align-self-center me-3 ms-0"}>
                        <div className="avatar-xs">
                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                {item.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {
                            item?.status && <span className="user-status"></span>
                        }
                    </div>
            }
         
            <div onClick={(e) => item.role === 'admin' ? sendCommunicationRequest(e) : openConversation(e)} className="cursor-pointer  w-full flex flex-row items-center justify-between overflow-hidden">
                <h5 className="text-truncate font-size-15 mb-1">{item.username}</h5>
                {item.role !== 'admin'  && <div className="font-size-16">
            {isLoading ? <div className='ri-loader-2-fill'/>   :  <i className="ri-message-3-line"></i>}
                </div>}
                {item.role === 'admin'  && <div className="font-size-16">
            {isLoading ? <div className='ri-loader-2-fill'/>   :    <i id="communication-request" className="self-center text-2xl ri-send-plane-line"></i>   }
                </div>}
                <UncontrolledTooltip target="communication-request" placement="top">
                        Requests Communication
                    </UncontrolledTooltip>
            </div>
      
        </div>
    )
}
function Users(props) {
    const user  = getLoggedInUser()
    const res = GetAllUsers()
    const users = res.data?.results
    const [searchChat, setSearchChat] = React.useState("");
    const [allUsers, setAllUsers] = React.useState(users);

    console.log("usershere", users)

    useEffect(() => {
        setAllUsers(users)
    }, [users])

    const   handleChange = (e) => {
        setSearchChat(e.target.value);
        var search = e.target.value;
        let allUsers = users;
        let filteredArray = [];
        //find allUsers name from array
        allUsers.forEach((item) => {
            if (item.username.toLowerCase().includes(search.toLowerCase())) {
                filteredArray.push(item);
           }
        });
        setAllUsers(filteredArray)

        if (search === "")   setAllUsers(users)
    }

    return (
        <React.Fragment>
        <div>
            <div className="px-4 pt-4">
                <div className="search-box item-search-box">
                    <InputGroup size="lg" className="mb-3 rounded-lg">
                        <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                            <i className="ri-search-line search-icon font-size-18"></i>
                        </span>
                        <Input type="text" value={searchChat} onChange={(e) => handleChange(e)} className="form-control bg-light" placeholder="Search advisors or users" />
                    </InputGroup>
                </div>
            </div>
            <SimpleBar style={{ maxHeight: "100%" }} className="item-message-list">

         <div>
         <h4 className="ml-6 mb-4 mt-2">Conseillers</h4>        
<ul className="list-unstyled item-list item-user-list pr-3 h-64 overflow-y-scroll " id="item-list">
    {
        (allUsers?.filter(item => item.role === 'admin'))?.map((item, key) =>{
        
            return (    <li key={key} id={"allUsers" + key} > 
            <UserItem setCurrentChat={props.setCurrentChat} setActiveTab={props.setActiveTab} item={item} user={user} />
            </li>)
        }
        )
    }
</ul>
         </div>

<div>
<h4 className="ml-6 mb-4 mt-4">All Users</h4>
<ul className="list-unstyled item-list item-user-list pr-3" id="item-list">
    {
       (allUsers?.filter(item => item.role !== 'admin' && item.id !== user.id))?.map((item, key) =>{
        
            return (    <li key={key} id={"allUsers" + key} > 
            <UserItem  setActiveTab={props.setActiveTab} setCurrentChat={props.setCurrentChat} item={item} user={user} />
            </li>)
        }
        )
    }
</ul>
</div>
</SimpleBar>
            </div>
        </React.Fragment>
    )
}

const mapStatetoProps = state => {
    return {};
};

export default connect(mapStatetoProps, {
    setActiveTab,
    setStoreCurrentChat
})(Users);