
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Input, InputGroup} from 'reactstrap';
import { getLoggedInUser } from '../../../../helpers/authUtils';
import { AllFriendsRequests } from '../../../../hooks/reactQuery';
import SimpleBar from "simplebar-react";
import { useQueryClient } from 'react-query';
import { getOpenRoomsApi, getOrCreateRoom } from '../../../../api/room';
import { OPEN_ROOMS } from '../../../../constants/queryKeys';
import { connect } from 'react-redux';
import { setStoreCurrentChat } from '../../../../redux/index';

export function friendObject(user, request) {
    if (request.to.id === user.id) return request.from
    return request.to
  }

const UserItem = (props) => {
    const {item, setCurrentChat, user} = props
    const [isLoading, setIsLoading] = useState(false)
    const cache = useQueryClient()
    const opponent = friendObject(user, item)

    async function openConversation() {
        console.log("dataroombro")
        setIsLoading(true)
        console.log("dataroombro1")
        try {
            console.log("dataroombro2")
            const data = await getOrCreateRoom(opponent.id)
            console.log("dataroombro3", data)
            if (data) {
              console.log("dataroombro$", data, user)
              cache.invalidateQueries(OPEN_ROOMS)
              const rooms = await getOpenRoomsApi()
              const currentroom = rooms.find((room) => room.id === data.id)
              console.log("dataroombro$0",currentroom)
              setCurrentChat({room: currentroom, user: user})
              props.setStoreCurrentChat({room: currentroom, user: user})
              setIsLoading(false)
            } else {
              setIsLoading(false)
            }
          } catch (err) {
            console.log(err)
            setIsLoading(false)
          }
      }

    return (
    
       
        <div className="d-flex px-4 pb-4">
            {
                    <div className={"item-user-img " + opponent?.status + " align-self-center me-3 ms-0"}>
                        <div className="avatar-xs">
                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                {opponent.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {
                            opponent?.status && <span className="user-status"></span>
                        }
                    </div>
            }
         
            <div onClick={openConversation} className="cursor-pointer  w-full flex flex-row items-center justify-between overflow-hidden">
                <h5 className="text-truncate font-size-15 mb-1">{opponent.username}</h5>
             <div className="font-size-16">
            {isLoading ? <div className='ri-loader-2-fill'/>   :  <i className="ri-message-3-line"></i>}
                </div>
            </div>
      
        </div>
    )
}
function Contacts(props) {
    const {setCurrentChat} = props;
    const user  = getLoggedInUser()
    const {data: AllCommunications} = AllFriendsRequests()
    const [searchChat, setSearchChat] = React.useState("");
    const [allUsers, setAllUsers] = React.useState(AllCommunications);

    console.log("usershere", AllCommunications)

    useEffect(() => {
        setAllUsers(AllCommunications)
    }, [AllCommunications])

    const   handleChange = (e) => {
        setSearchChat(e.target.value);
        var search = e.target.value;
        let allUsers = AllCommunications;
        let filteredArray = [];
        //find allUsers name from array
        allUsers.forEach((item) => {
            const opponent = friendObject(user, item)
            if (opponent.username.toLowerCase().includes(search.toLowerCase())) {
                filteredArray.push(item);
           }
        });
        setAllUsers(filteredArray)

        if (search === "")   setAllUsers(AllCommunications)
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
                        <Input type="text" value={searchChat} onChange={(e) => handleChange(e)} className="form-control bg-light" placeholder="Search Contacts" />
                    </InputGroup>
                </div>
            </div>
            <SimpleBar style={{ maxHeight: "100%" }} className="item-message-list">


<div>
<h4 className="ml-6 mb-4">All Contacts</h4>
<ul className="list-unstyled item-list item-user-list pr-3" id="item-list">
    {
       (allUsers?.filter(item => item.role !== 'admin'))?.map((item, key) =>{
        
            return (    <li key={key} id={"allUsers" + key} > 
            <UserItem setCurrentChat={setCurrentChat} item={item} user={user} />
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

export default connect(null, {setStoreCurrentChat})(Contacts);
