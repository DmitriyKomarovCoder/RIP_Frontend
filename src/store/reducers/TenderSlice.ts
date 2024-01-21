import {IDeleteCompanyTender, ITender, IRequest} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface TenderState {
    tender: IRequest | null;
    singleTender: ITender | null,
    isLoading: boolean;
    error: string;
    success: string;
}

const initialState: TenderState = {
    tender: null,
    singleTender: null,
    isLoading: false,
    error: '',
    success: ''
}

export const tenderSlice = createSlice({
    name: 'tender',
    initialState,
    reducers: {
        tendersFetching(state) {
            state.isLoading = true
        },
        tendersFetched(state, action: PayloadAction<IRequest>) {
            state.isLoading = false
            state.error = ''
            state.tender = action.payload
        },
        tenderFetched(state, action: PayloadAction<ITender>) {
            state.isLoading = false
            state.error = ''
            state.singleTender = action.payload
        },
        tendersDeleteSuccess(state, action: PayloadAction<IDeleteCompanyTender>) {
            state.isLoading = false
            const text = action.payload.description ?? ""
            state.error = text
            state.success = "Компания успешна удалена из заявки"
        },
        tendersUpdated(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        tendersDeleteError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
        tendersFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export default tenderSlice.reducer;