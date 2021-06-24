import { createSlice } from '@reduxjs/toolkit'

export const clientSlice = createSlice({
    name: 'client',
    initialState: {
        value: 0,
        accessToken: null,
        isLoggedIn: false,
        refreshToken: null,
        searcherAccessToken: null,
        tel_id: '',
        time: null,
        data: {}
    },
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action?.payload?.accessToken
            state.refreshToken = action?.payload?.refreshToken
            state.tel_id = action?.payload?.tel_id
        },
        setSearchToken: (state, action) => {
            state.searcherAccessToken = action?.payload?.searcherAccessToken
        },
        setData: (state, action) => {
            state.data = action.payload
        },
        setTime: (state, action) => {
            state.time = action.payload
        },
        logout: (state) => {
            state.data = {}
            state.isLoggedIn = false
            state.accessToken = null
            state.refreshToken = null
            state.tel_id = ''
        },
    },
})

// Action creators are generated for each case reducer function
export const { setData, setTokens, logout, setTime, setSearchToken } = clientSlice.actions

export default clientSlice.reducer