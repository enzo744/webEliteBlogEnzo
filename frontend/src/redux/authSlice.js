import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        userProfile:null,
        currentUser:null
    },
    reducers:{
        //actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        setUserProfile:(state, action) => {
            state.userProfile = action.payload;
        },
        signInSuccess:(state, action) => {
            state.currentUser = action.payload;
        }
    }
});
export const {setLoading, setUser, setUserProfile, signInSuccess} = authSlice.actions;
export default authSlice.reducer;