import {useNavigate} from 'react-router-dom';
import {FC, useEffect} from 'react';
import {ICompany} from "../../models/models.ts";
import List from "../List.tsx";
import CompanyItem from "../CompanyItem/CompanyItem.tsx";
import './CompaniesList.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchCompanies} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
// import Button from "react-bootstrap/Button";

interface CompaniesListProps {
    setPage: () => void
}

const CompaniesList: FC<CompaniesListProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {companies, isLoading, error, success /*,draftID*/} = useAppSelector(state => state.companyReducer)
    const navigate = useNavigate();
    const {searchValue} = useAppSelector(state => state.progressReducer)

    useEffect(() => {
        setPage()
        dispatch(fetchCompanies(searchValue))
    }, [searchValue]);

    // const didTapBasket = () => {
    //     navigate(`/tenders/${draftID}`);
    // }

    if (!companies) {
        return <h3>Данных нет</h3>
    }

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            {/*<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>*/}
            {/*    <Button*/}
            {/*        variant="primary"*/}
            {/*        onClick={didTapBasket}*/}
            {/*        disabled={draftID == 0}*/}
            {/*        style={{position: 'absolute', right: 40}}*/}
            {/*    >*/}
            {/*        Создать тендер*/}
            {/*    </Button>*/}
            {/*</div>*/}
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