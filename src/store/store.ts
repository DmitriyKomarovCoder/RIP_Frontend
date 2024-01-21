import {combineReducers, configureStore} from "@reduxjs/toolkit";
import companyReducer from "./reducers/CompanySlice.ts"
import tenderReducer from "./reducers/TenderSlice.ts"
import userReducer from "./reducers/UserSlice.ts"
import progressReducer from "./reducers/ProgressData.ts";
import searchReducer from "./reducers/SearchSlice.ts"
const rootReducer = combineReducers({
    companyReducer,
    tenderReducer,
    userReducer,
    progressReducer,
    searchReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']