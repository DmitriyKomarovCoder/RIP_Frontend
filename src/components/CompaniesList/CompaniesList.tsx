import {useNavigate} from 'react-router-dom';
import React, {FC, useEffect} from 'react';
import {ICompany} from "../../models/models.ts";
import List from "../List.tsx";
import CompanyItem from "../CompanyItem/CompanyItem.tsx";
import './CompaniesList.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchCompanies} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Button, Form} from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";
// import {progressSlice} from "../../store/reducers/ProgressData.ts";
import {searchSlice} from "../../store/reducers/SearchSlice.ts";
import {RootState} from "../../store/store.ts";
import {useSelector} from "react-redux";
//import {companySlice} from "../../store/reducers/CompanySlice.ts";
// import {useSelector} from "react-redux";
// import {RootState} from "../../store/store.ts";

// import Button from "react-bootstrap/Button";

interface CompaniesListProps {
    setPage: () => void
}

const CompaniesList: FC<CompaniesListProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const searchText = useSelector((state: RootState) => state.searchReducer.type);
    const {companies, isLoading, error, success /*,draftID*/} = useAppSelector(state => state.companyReducer)
    const navigate = useNavigate();
    //const {searchValue} = useAppSelector(state => state.progressReducer)

    useEffect(() => {
        setPage()
        dispatch(fetchCompanies(searchText))
    }, [dispatch]);

    if (!companies) {
        return <h3>Данных нет</h3>
    }

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        dispatch(fetchCompanies(searchText))
    }

    return (
    
        <>
            <Form onSubmit={handleSearch} className="d-flex">
                <FormControl
                    id={'search-text-field'}
                    type="text"
                    value={searchText}
                    placeholder="Поиск компаний"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => dispatch(searchSlice.actions.setType(e.target.value))}

                />

                <Button type="submit" variant="outline-light">
                    Поиск
                </Button>

            </Form> 
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <List items={companies ?? []} renderItem={(company: ICompany) =>
                <CompanyItem
                    key={company.company_id}
                    company={company}
                    isServer={true}
                    onClick={(num) => navigate(`/companies/${num}`)}
                />
            }
            />
        </>
    )
};

export default CompaniesList;