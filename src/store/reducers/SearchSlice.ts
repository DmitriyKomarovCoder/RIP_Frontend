import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface searchState {
    type: string

    user: string
    status: string
    formationDateStart: string | null
    formationDateEnd: string | null
}

const initialState: searchState = {
    type: '',

    user: '',
    status: '',
    formationDateStart: null,
    formationDateEnd: null,
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
            state.status = action.payload
        },
        setDateStart: (state, action: PayloadAction<string>) => {
            state.formationDateStart = action.payload
        },
        setDateEnd: (state, action: PayloadAction<string>) => {
            state.formationDateEnd = action.payload
        },
        reset: (state) => {
            state.type = ''
            state.formationDateEnd = null
            state.user = ''
            state.status = ''
            state.formationDateStart = null
        }
    },
});

export default searchSlice.reducer;