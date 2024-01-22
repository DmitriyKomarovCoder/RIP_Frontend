import {ICompany} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CompanyState {
    companies: ICompany[];
    company: ICompany | null,
    isLoading: boolean;
    error: string;
    success: string;
    cash: number;
    // draftID: number;
}

const initialState: CompanyState = {
    companies: [],
    company: null,
    isLoading: false,
    error: '',
    success: '',
    cash: 0.0,
    // draftID: 0
}

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        increase(state) {
            state.cash += 1000
        },
        minus(state) {
            state.cash = state.cash == 0 ? 0 :  state.cash - 1000
        },
        reset(state) {
            state.cash = 0
        },
        companiesFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        companiesFetched(state, action: PayloadAction<[ICompany[], number]>) {
            state.isLoading = false
            state.companies = action.payload[0]
            // state.draftID = action.payload[1]
        },
        companiesFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.success = ''
        },
        // setDraft(state, action: PayloadAction<number>) {
        //     state.draftID = action.payload
        // },
        companyAddedIntoTender(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        companyFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        companyFetched(state, action: PayloadAction<ICompany>) {
            state.isLoading = false
            state.error = ''
            state.company = action.payload
        },
        companyFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.companies = []
            state.company = null
        },
    },
})

export default companySlice.reducer;