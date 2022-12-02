import { createSlice } from "@reduxjs/toolkit";
import { changeLayoutMode } from "./async-functions";

const initialState = {
	activeTab : "home",
	userSidebar : false,
	conversationName : "Doris Brown",
	layoutMode : "light"
};


const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
		setActiveTab: (state, action) => {
			return {
				...state,
				activeTab: action.payload
			};
		},
		openUserSidebar: (state, action) => {
			return {
				...state,
				userSidebar: true
			};
		},
		closeUserSidebar: (state, action) => {
			return {
				...state,
				userSidebar: false
			};
		},
		setconversationNameInOpenChat: (state, action) => {
			return {
				...state,
				conversationName: action.payload
			};
		},
		default: (state, action) => {
			return state;
		}
	},
    extraReducers: builder => {
    builder
	.addCase(changeLayoutMode.pending, (state, action) => {
			state.loading = true
		}).addCase(changeLayoutMode.fulfilled, (state, action) => {
			state.loading = false
			state.layoutMode = action.payload
		}).addCase(changeLayoutMode.rejected, (state, action) => {
			state.loading = false
		})
	}
});

export const {setActiveTab, openUserSidebar, closeUserSidebar, setconversationNameInOpenChat } = layoutSlice.actions

export default layoutSlice.reducer