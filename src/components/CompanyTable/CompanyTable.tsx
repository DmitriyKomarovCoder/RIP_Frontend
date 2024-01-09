import CompanyTableCell from './CompanyTableCell';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {FC, useEffect} from "react";
import {fetchCompanies} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import './CompanyTable.css'

interface CompanyTableProps {
    setPage: () => void
}

const CompanyTable: FC<CompanyTableProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {companies, isLoading, error, success} = useAppSelector(state => state.companyReducer)
    useEffect(() => {
        setPage()
        dispatch(fetchCompanies())
    }, []);

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Nav className="ms-2">
                <Nav.Item>
                    <Link to="/add-company-2" className="btn btn-outline-primary mt-2"
                          style={{marginLeft: '80px', marginBottom: '30px'}}>
                        Добавить компанию
                    </Link>
                </Nav.Item>
            </Nav>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название компании</th>
                    <th>Статус</th>
                    <th>Описание</th>
                    <th>Изображение</th>
                </tr>
                </thead>
                <tbody>
                {companies.map(company => (
                    <CompanyTableCell companyData={company}/>
                ))
                }
                </tbody>
            </table>
        </>
    );
};

export default CompanyTable;
