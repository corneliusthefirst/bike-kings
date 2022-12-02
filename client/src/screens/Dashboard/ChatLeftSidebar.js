import React from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

//Import Components
import Profile from "./Tabs/Profile";
import Chats from "./Tabs/Chats";
import Groups from "./Tabs/groups/index";
import Users from "./Tabs/users/index";
import Settings from "./Tabs/Settings";

function ChatLeftSidebar(props) {

    const activeTab = props.activeTab;
    

    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-1">

                <TabContent activeTab={activeTab}>
                    {/* Start Profile tab-pane */}
                    <TabPane tabId="profile" id="pills-user">
                        {/* profile content  */}
                        <Profile />
                    </TabPane>
                    {/* End Profile tab-pane  */}

                    {/* Start chats tab-pane  */}
                    <TabPane tabId="chat" id="pills-chat">
                        {/* chats content */}
                        <Chats currentChat={props.currentChat} setCurrentChat={props.setCurrentChat}/>
                    </TabPane>
                    {/* End chats tab-pane */}

                    {/* Start groups tab-pane */}
                    <TabPane tabId="group" id="pills-groups">
                        {/* Groups content */}
                        <Groups  setCurrentChat={props.setCurrentChat} />
                    </TabPane>
                    {/* End groups tab-pane */}

                    {/* Start users tab-pane */}
                    <TabPane tabId="users" id="pills-users">
                        {/* Contact content */}
                        <Users setCurrentChat={props.setCurrentChat} />
                    </TabPane>
                    {/* End users tab-pane */}

                    {/* Start settings tab-pane */}
                    <TabPane tabId="settings" id="pills-setting">
                        {/* Settings content */}
                        <Settings />
                    </TabPane>
                    {/* End settings tab-pane */}
                </TabContent>
                {/* end tab content */}

            </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
        ...state.Layout
    };
};

export default connect(mapStatetoProps, null)(ChatLeftSidebar);