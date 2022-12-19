import React from 'react';
// Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat";

import {connect} from "react-redux";
import {Products} from '../../components';
import useStyles from "./styles";
import { isUserAuthenticated } from '../../helpers/authUtils';
import { useNavigate } from 'react-router-dom';

const Index = (props) => {
    const {
        users,
        activeTab,
        products,
        handleAddToCart,
        handleUpdateCartQty,
        userSidebar,
        currentChat: currentchat
    } = props;
    const classes = useStyles();
    const [currentChat, setCurrentChat] = React.useState(currentchat);
    const navigate = useNavigate()

    if(isUserAuthenticated() === false){
       navigate('/login')
    }

    return activeTab === "home" ? (
        <Products products={products}
            onAddToCart={handleAddToCart}
            handleUpdateCartQty={handleUpdateCartQty}/>
    ) : (
        <main className={
            classes.content
        }>
       
            <div className='flex flex-1 flex-row'>
                {/* chat left sidebar */}
                <ChatLeftSidebar currentChat={currentChat} setCurrentChat={setCurrentChat} /> {/* user chat */}
                <UserChat recentChatList={users} currentChat={currentChat} setCurrentChat={setCurrentChat}  userSidebar={userSidebar} />
            </div>
        </main>
    );
}

const mapStateToProps = (state) => {
    const {currentChat} = state.Chat;
    const {activeTab, userSidebar} = state.Layout;
    return {activeTab, currentChat, userSidebar};
};

export default connect(mapStateToProps, {})(Index);
