import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    ICompanyResponse,
    ICompanyWithDraft,
    IDeleteCompanyTender,
    ITenderResponse, IRegisterResponse,
    IRequest,
    mockCompanies
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {companySlice} from "./CompanySlice.ts"
import {tenderSlice} from "./TenderSlice.ts";
import {userSlice} from "./UserSlice.ts";


export const fetchCompanies = (searchValue?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(companySlice.actions.companiesFetching())
        const response = await axios.get<ICompanyWithDraft>('/api/companies' + `?company_name=${searchValue ?? ''}`)
        dispatch(companySlice.actions.companiesFetched(response.data.companies))
    } catch (e) {
        dispatch(companySlice.actions.companiesFetchedError(`Ошибка: ${e}`))
        dispatch(companySlice.actions.companiesFetched(filterMockData(searchValue)))
    }
}

export const addCompanyIntoTender = (companyId: number, cash: number, companyName: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "post",
        url: "/api/companies/request",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            company_id: companyId,
            cash: cash
        }
    }

    try {
        dispatch(companySlice.actions.companiesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Компания "${companyName}" добавлен`
        dispatch(companySlice.actions.companyAddedIntoTender([errorText, successText]));
        setTimeout(() => {
            dispatch(companySlice.actions.companyAddedIntoTender(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(companySlice.actions.companiesFetchedError(`${e}`))
    }
}

export const deleteTender = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "delete",
        url: "/api/tenders",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id
        }
    }
    try {
        dispatch(tenderSlice.actions.tendersFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        dispatch(tenderSlice.actions.tendersUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchTenders())
        }
        setTimeout(() => {
            dispatch(tenderSlice.actions.tendersUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(tenderSlice.actions.tendersDeleteError(`${e}`))
    }
}

export const makeTender = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: "/api/tenders/form",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {}
    }
    try {
        dispatch(tenderSlice.actions.tendersFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(tenderSlice.actions.tendersUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchTenders())
        }
        setTimeout(() => {
            dispatch(tenderSlice.actions.tendersUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(tenderSlice.actions.tendersDeleteError(`${e}`))
    }
}

export const fetchTenders = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(tenderSlice.actions.tendersFetching())
        const response = await axios.get<ITenderResponse>(`/api/tenders`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            tenders: response.data.tenders,
            status: response.data.status
        };

        dispatch(tenderSlice.actions.tendersFetched(transformedResponse))
    } catch (e) {
        dispatch(tenderSlice.actions.tendersFetchedError(`${e}`))
    }
}

export const deleteTenderById = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(tenderSlice.actions.tendersFetching())
        const response = await axios.delete<IDeleteCompanyTender>(`/api/tender-request-company`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            },
        });
        dispatch(tenderSlice.actions.tendersDeleteSuccess(response.data))
        dispatch(fetchTenders())
    } catch (e) {
        dispatch(tenderSlice.actions.tendersFetchedError(`${e}`))
    }
}

export const updateTenderCompany = (index: number, newCash: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/tender-request-company",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            //description: description,
            cash: newCash,
            // creation_date: convertInputFormatToServerDate(startDate),
            // completion_date: convertInputFormatToServerDate(endDate),
            id: index,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(tenderSlice.actions.tendersUpdated([errorText, successText]));
        //dispatch(tenderSlice.actions.tendersDeleteSuccess(response.data))
        dispatch(fetchTenders())
    } catch (e) {
        dispatch(tenderSlice.actions.tendersFetchedError(`${e}`))
    }
}

export const updateTender = (
    id: number,
    //description: string,
    tenderName: string,
    // startDate: string,
    // endDate: string,
    //leader: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/tenders",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            //description: description,
            tender_name: tenderName,
            // creation_date: convertInputFormatToServerDate(startDate),
            // completion_date: convertInputFormatToServerDate(endDate),
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(tenderSlice.actions.tendersUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(tenderSlice.actions.tendersUpdated(['', '']));
        }, 5000);
        dispatch(fetchTenders())
    } catch (e) {
        dispatch(tenderSlice.actions.tendersFetchedError(`${e}`));
    }
}

export const fetchCompany = (
    companyId: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(companySlice.actions.companiesFetching())
        const response = await axios.get<ICompanyResponse>(`/api/companies/${companyId}`)
        const company = response.data.company
        setPage(company.name ?? "Без названия", company.company_id)
        dispatch(companySlice.actions.companyFetched(company))
    } catch (e) {
        console.log(`Ошибка загрузки городов: ${e}`)
        const previewID = companyId !== undefined ? parseInt(companyId, 10) - 1 : 0;
        const mockCompany = mockCompanies[previewID]
        setPage(mockCompany.name ?? "Без названия", mockCompany.company_id)
        dispatch(companySlice.actions.companyFetched(mockCompany))
    }
}

export const registerSession = (userName: string, login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/user/signUp",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'name': userName,
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IRegisterResponse>(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Регистрация прошла успешно"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

export const logoutSession = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/user/logout",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Попробуйте ещё раз"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))

        if (errorText == '') {
            Cookies.remove('jwtToken');
            dispatch(userSlice.actions.setAuthStatus(false))
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}


export const loginSession = (login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/user/signIn",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IAuthResponse>(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Авторизация прошла успешна"
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            dispatch(userSlice.actions.setAuthStatus(true));
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000);
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// MARK: - Mock data

function filterMockData(searchValue?: string) {
    if (searchValue) {
        const filteredCompanies = mockCompanies.filter(company =>
            company.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
        );
        if (filteredCompanies.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")

        }
        return filteredCompanies
    }
    return mockCompanies
}

export function DateFormat(dateString: string) {
    if (dateString == "0001-01-01T00:00:00Z") {
        return "Дата не указана"
    }
    const date = new Date(dateString);
    return `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
}

export function emptyString(text: string, emptyText: string) {
    return text == "" ? emptyText : text
}

export const convertServerDateToInputFormat = (serverDate: string) => {
    const dateObject = new Date(serverDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// function convertInputFormatToServerDate(dateString: string): string {
//     const dateRegex = /^4-2-2T2:2:2Z2:2/;
//     if (dateRegex.test(dateString)) {
//         return dateString;
//     } else {
//         const date = new Date(dateString);
//         const isoDate = date.toISOString();
//         return isoDate;
//     }
// }