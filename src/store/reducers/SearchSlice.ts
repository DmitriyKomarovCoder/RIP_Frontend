import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface searchState {
    type: string
    user: string
    selectedStatus: string
    startDate: string | null
    endDate: string | null
}

const initialState: searchState = {
    type: '',

    user: '',
    selectedStatus: '',
    startDate: null,
    endDate: null,
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setType: (state, action: PayloadAction<string>) => {
            state.type = action.payload
        },
        setUser: (state, action: PayloadAction<string>) => {
            state.user = action.payload
        },
        setStatus: (state, action: PayloadAction<string>) => {
            state.selectedStatus = action.payload
        },
        setDateStart: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload;
        },
        setDateEnd: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload;
        },

        reset: (state) => {
            state.type = ''
            state.endDate = null
            state.user = ''
            state.selectedStatus = ''
            state.startDate = null
        }
    },
});

export default searchSlice.reducer;