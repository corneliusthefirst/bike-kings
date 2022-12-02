import React from 'react';
import {
    Nav,
    NavItem,
    TabContent,
    TabPane,
    NavLink,
    UncontrolledTooltip
} from "reactstrap";

// Import Components
import CommunicationRequest from "./CommunicationRequest/index";
import Contacts from "./Contacts";
import Users from "./Users";
import classnames from "classnames";
import { isAdmin } from '../../../../helpers/authUtils';

function UsersComponent(props) {
    const [activeTab, setActiveTab] = React.useState('users');
    const isadmin = isAdmin()
    const toggleTab = tab => {
        setActiveTab(tab);
    };

    return (
        <div className='h-screen '>
            <div className="flex-lg-row my-auto w-full justify-around bg-white">
                <Nav pills className="side-menu-nav justify-content-center" role="tablist">

                    <NavItem id="users" className={`flex ${isadmin ? 'w-1/3' : 'w-1/2'} justify-center`}>
                        <NavLink id="pills-users"
                            className={
                                classnames({
                                    active: activeTab === 'users'
                                })
                            }
                            onClick={
                                () => {
                                    toggleTab('users')
                                }
                        }>
                            <i className="ri-group-line"></i>
                        </NavLink>
                    </NavItem>
                    <UncontrolledTooltip target="users" placement="top">
                        All Users
                    </UncontrolledTooltip>
                    <NavItem id="contacts-tab" className={`flex ${isadmin ? 'w-1/3' : 'w-1/2'} justify-center`}>
                        <NavLink id="pills-user-tab"
                            className={
                                classnames({
                                    active: activeTab === 'contacts'
                                })
                            }
                            onClick={
                                () => {
                                    toggleTab('contacts');
                                }
                        }>
                            <i className="text-2xl ri-user-3-line"></i>
                        </NavLink>
                    </NavItem>
                    <UncontrolledTooltip target="contacts-tab" placement="top">
                        Contacts
                    </UncontrolledTooltip>

                    {isadmin && <NavItem id="communication-request-tab" className='flex w-1/3'>
                        <NavLink id="pills-communication-request-tab"
                            className={
                                `flex w-full ${
                                    classnames({
                                        active: activeTab === 'communication-request'
                                    })
                                }`
                            }
                            onClick={
                                () => {
                                    toggleTab('communication-request');
                                }
                        }>
                            <i className="self-center text-2xl ri-send-plane-2-line"></i>
                        </NavLink>
                    </NavItem>}
                    {isadmin && <UncontrolledTooltip target="communication-request-tab" placement="top">
                        Communication Requests
                    </UncontrolledTooltip>}
                </Nav>
            </div>
            <div  className="chat-leftsidebar me-lg-1 overflow-y-scroll">

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="users" id="pills-users">
                        <Users setCurrentChat={props.setCurrentChat}/>
                    </TabPane>

                    <TabPane tabId="contacts" id="pills-contacts">
                        <Contacts setCurrentChat={props.setCurrentChat}/>
                    </TabPane>

                    <TabPane tabId="communication-request" id="pills-communication-request-tab">
                        <CommunicationRequest setCurrentChat={props.setCurrentChat} />
                    </TabPane>

                </TabContent>

            </div>
        </div>
    );
}

export default UsersComponent;
