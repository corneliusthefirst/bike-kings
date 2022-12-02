import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentChat: { //default chat
        room: {
            roomDeletedBySender: false,
            roomDeletedByReceiver: false,
            sender: {
                role: "user",
                isEmailVerified: false,
                email: "madmax2000@gmail.com",
                username: "madmax2000",
                shortId: "3985",
                color: "yellow",
                createdAt: "2022-11-13T17:47:03.890Z",
                updatedAt: "2022-11-13T17:47:03.890Z",
                id: "63712d97199677a045f6f300"
            },
            receiver: {
                role: "admin",
                isEmailVerified: false,
                email: "christina2000@gmail.com",
                username: "christina2000",
                shortId: "3356",
                color: "sideBarChannels",
                createdAt: "2022-11-13T18:36:49.329Z",
                updatedAt: "2022-11-13T18:36:49.329Z",
                id: "63713941409a74b3738f66a7",
            },
            createdAt: "2022-11-13T18:40:15.217Z",
            updatedAt: "2022-11-13T18:40:15.217Z",
            id: "63713a0f409a74b3738f6723"
        },
        user: {
            "role": "user",
            "isEmailVerified": false,
            "email": "madmax2000@gmail.com",
            "username": "madmax2000",
            "shortId": "3985",
            "color": "yellow",
            "createdAt": "2022-11-13T17:47:03.890Z",
            "updatedAt": "2022-11-13T17:47:03.890Z",
            "id": "63712d97199677a045f6f300"
        }
    },
};


const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setStoreCurrentChat: (state, action) => {
            return { ...state, currentChat: action.payload };
        },
        chatUser:(state, action) => {
            return { ...state };
        },

        activeUser:(state, action) => {
            return {
                ...state,
                active_user : action.payload };
        },

        setFullUser : (state, action) => {
            return {
                ...state,
                users : action.payload };
        },

        addLoggedinUser: (state, action) => {
            const newUser =  action.payload
            return{
                ...state, users : [
                    ...state.users, newUser
                ]
            };
        },

        createGroup: (state, action) => {
            const newGroup =  action.payload
            return {
                ...state, groups : [
                    ...state.groups, newGroup
                ]
            }
        }
}
});

export const {setStoreCurrentChat,  chatUser, activeUser, setFullUser, addLoggedinUser, createGroup } = chatSlice.actions

export default chatSlice.reducer