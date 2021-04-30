import { createSlice } from '@reduxjs/toolkit'

export const clientSlice = createSlice({
    name: 'global',
    initialState: {
        isChecked: false
    },
    reducers: {
        setCheck: (state, action) => {
            state.isChecked = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCheck } = clientSlice.actions

export default clientSlice.reducer