import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import CompaniesList from "./components/CompaniesList/CompaniesList.tsx";
import CompanyDetail from "./components/CompanyDetail/CompanyDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";

function App() {
    const companiesPage = {name: 'Компании', to: 'companies'};
    const requestPage = {name: 'Заявка', to: 'request'};
    const [searchValue, setSearchValue] = useState('')
    const [pages, setPage] = useState<IBreadCrumb[]>([companiesPage])
    const addPage = (newPage: IBreadCrumb[]) => {
        setPage(newPage);
    };
    const resetSearchValue = () => {
        setSearchValue('');
    };

    return (
        <>
            <NavigationBar handleSearchValue={(value) => setSearchValue(value)}/>
            <BreadCrumbs pages={pages}/>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="companies"/>}/>
                    <Route path="/companies"
                           element={
                               <CompaniesList
                                   setPage={() => addPage([companiesPage])}
                                   searchValue={searchValue}
                                   resetSearchValue={resetSearchValue}
                               />
                           }
                    />
                    <Route path="/request"
                           element={
                               <RequestView
                                   setPage={() => addPage([requestPage])}
                               />
                           }
                    />
                    <Route path="/login"
                           element={
                               <LoginPage/>
                           }
                    />
                    <Route path="/register"
                           element={
                               <RegisterPage/>
                           }
                    />
                    <Route path="/companies/:id" element={
                        <CompanyDetail
                            setPage={(name, id) => addPage([
                                companiesPage, {name: `Компания-${name}`, to: `companies/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
