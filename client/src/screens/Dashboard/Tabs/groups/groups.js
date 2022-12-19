import React, { useState } from 'react';
import { useEffect } from 'react';
import { Input, InputGroup } from 'reactstrap';
import { getLoggedInUser } from '../../../../helpers/authUtils';
import SimpleBar from "simplebar-react";
import { connect } from 'react-redux';
import {setActiveTab, setStoreCurrentChat} from '../../../../redux/index';
import ReactGA from 'react-ga'
import { isMemberOfGroup } from '../../../../hooks/actions';
import { getAllGroupsApi, joinGroupApi } from '../../../../api/group';

const UserItem = (props) => {
    const {item, user, joinGroup} = props
    const [isLoading, setIsLoading] = useState(false)

    const isMember = isMemberOfGroup(item, user)

    async function openConversation() {
        if(isMember){
            props?.setCurrentChat({room: item , user: user})
            props?.setStoreCurrentChat({room: item, user: user})
        }
      }

    
    return (
    
       
        <div className="d-flex px-4 pb-4">
            {
                    <div className={"item-user-img " + item?.status + " align-self-center me-3 ms-0"}>
                        <div className="avatar-xs">
                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                {item.groupName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {
                            item?.sender?.status && <span className="user-status"></span>
                        }
                    </div>
            }
         
            <div onClick={(e) => isMember ?  openConversation() : joinGroup(item, setIsLoading)} className="cursor-pointer  w-full flex flex-row items-center justify-between overflow-hidden">
                <h5 className="text-truncate font-size-15 mb-1">#{item.groupName}</h5>
                {isMember  && <div className="font-size-16">
            {isLoading ? <div className='ri-loader-2-fill'/>   :  <i className="ri-message-3-line"></i>}
                </div>}
                {!isMember  && <div className="font-size-16">
            {isLoading ? <div className='ri-loader-2-fill'/>   :    <p className='px-4 py-1 bg-green-300 rounded-full'>Join</p>   }
                </div>}
            </div>
      
        </div>
    )
}



const Groups = (props) =>  {
    const {groups, allGroups, setGroups} = props
    const user  = getLoggedInUser()
    const [searchChat, setSearchChat] = useState("");

    console.log("resallGroups", allGroups)

    useEffect(() => {}, [allGroups])

    const handleChange = (e) => {
        setSearchChat(e.target.value);
        var search = e.target.value;
        if(search.length > 0){
            let filteredArray = [];
            groups.forEach((item) => {
                if (item.groupName.toLowerCase().includes(search.toLowerCase())) {
                    filteredArray.push(item);
            }
            });
            setGroups(filteredArray)
        }else{
            setGroups(groups)
        }
    }

    const joinGroup = async (item, setIsLoading) => {
        console.log("item", item)
        if(item.members && item.groupLimit && item.members.length >= item.groupLimit){
            alert('Group limit reached.You cannot join this bikeHub')
            return
        }
        setIsLoading(true)
        try{
            await joinGroupApi(item.id)
            setIsLoading(false)
            ReactGA.event({
                category: 'Join Group',
                action: `${user.username} Joined the Group ${item.groupName}`,
            })
            const data= await getAllGroupsApi()
            setGroups(data);
            console.log("joinGroupApi", data)
        }catch(err){
            setIsLoading(false)
            console.log("err", err)
            }
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
                        <Input type="text" value={searchChat} onChange={(e) => handleChange(e)} className="form-control bg-light" placeholder="Search advisors or allGroups" />
                    </InputGroup>
                </div>
            </div>
            <SimpleBar style={{ maxHeight: "100%" }} className="item-message-list">


<div>
<h4 className="ml-6 mb-4 mt-4">Groups</h4>
<ul className="list-unstyled item-list item-user-list pr-3" id="item-list">
    {
       (allGroups?.filter(item => item.role !== 'admin' && item.id !== user.id))?.map((item, key) =>{
        
            return (    <li key={key} id={"allGroups" + key} > 
            <UserItem joinGroup={joinGroup}  setActiveTab={props.setActiveTab} setCurrentChat={props.setCurrentChat} item={item} user={user} />
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
})(Groups);