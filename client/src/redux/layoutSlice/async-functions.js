// @flow
import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Changes the body attribute
 */
const  changeBodyAttribute = (attribute, value) => {
    if (document.body) document.body.setAttribute(attribute, value);
    return true;
}

/**
 * Changes the layout mode
 * @param {*} param0
 */
export const changeLayoutMode = createAsyncThunk('changelayout', async({ payload: { layoutMode } }) => {
    try {
        if (layoutMode === "dark") {
            changeBodyAttribute("data-layout-mode", layoutMode);
            localStorage.setItem("layoutMode", layoutMode);
        } else {
            changeBodyAttribute("data-layout-mode", layoutMode);
            localStorage.setItem("layoutMode", layoutMode);
        }
        return layoutMode
    } catch (error) {
        return error
    }
})