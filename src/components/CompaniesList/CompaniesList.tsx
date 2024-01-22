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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import Nav from "react-bootstrap/Nav";
//import {companySlice} from "../../store/reducers/CompanySlice.ts";
// import {useSelector} from "react-redux";
// import {RootState} from "../../store/store.ts";

// import Button from "react-bootstrap/Button";

interface CompaniesListProps {
    setPage: () => void
    draftID: number | null
    setDraftID: (draftID: number | null) => void;
}

const CompaniesList: FC<CompaniesListProps> = ({setPage, draftID, setDraftID}) => {
    const dispatch = useAppDispatch()
    const searchText = useSelector((state: RootState) => state.searchReducer.type);
    const {companies, isLoading, error, success /*,draftID*/} = useAppSelector(state => state.companyReducer)
    const navigate = useNavigate();
    //const {searchValue} = useAppSelector(state => state.progressReducer)
    //const [draftID, setDraft] = useState<number | null>(null)

    useEffect(() => {
        setPage();
        const fetchCompaniesAndSetDraft = async () => {
            const draftId = await dispatch(fetchCompanies(searchText));
            setDraftID(draftId);
        };
        fetchCompaniesAndSetDraft();
    }, []);

    if (!companies) {
        return <h3>Данных нет</h3>
    }

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        dispatch(fetchCompanies(searchText))
    }

    return (
    
        <>
            <Nav.Item className="mx-2">
                <FontAwesomeIcon
                    icon={faShoppingCart}
                    className={`my-2 mr-2 ${draftID === 0 ? 'disabled' : ''}`}
                    onClick={() => draftID !== 0 && navigate(`/tenders/${draftID}`)}
                    style={{
                        cursor: draftID === 0 ? 'not-allowed' : 'pointer',
                        fontSize: draftID === 0 ? '1.5em' : '2em', // Измените размер в зависимости от условия
                        color: draftID === 0 ? '#777777' : 'white', // Измените цвет в зависимости от условия
                        transition: 'color 0.3s ease', // Добавьте плавный переход цвета
                    }}
                />
            </Nav.Item>
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
                    setDraftID={setDraftID}
                />
            }
            />
        </>
    )
};

export default CompaniesList;