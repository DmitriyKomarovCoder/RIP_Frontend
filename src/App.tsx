import {Routes, Route} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import CompaniesList from "./components/CompaniesList/CompaniesList.tsx";
import CompanyDetail from "./components/CompanyDetail/CompanyDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {Breadcrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";
import CompanyTable from "./components/CompanyTable/CompanyTable.tsx";
import CreateCompanyPage from "./components/TableView/AddCompany.tsx";
import TenderCard from "./components/RequestView/TenderCard.tsx";
// import Menu from "./components/Menu/Menu.tsx";

function App() {
    const homePage: Breadcrumb = {name: 'Главная', to: 'companies'};
    const addCompanyPage: Breadcrumb = {name: 'Созадние компании', to: 'add-company'};
    const companiesTablePage: Breadcrumb = {name: 'Таблица компаний', to: 'companies/admin'};
    const companiesPage: Breadcrumb = {name: 'Компании', to: 'companies'};
    const requestPage: Breadcrumb = {name: 'Заявки', to: 'request'};
    const [pages, setPage] = useState<Breadcrumb[]>([companiesPage])
    const [draftID, setDraftID] = useState<number | null>(0);

    const addPage = (newPage: Breadcrumb[]) => {
        setPage(newPage);
    };

    return (
        <>
            <NavigationBar/>
            <BreadCrumbs paths={pages}/>
            <>
                <Routes>

                    <Route path="/companies" element={
                        <CompaniesList
                            setPage={() => addPage([homePage])}
                            draftID={draftID}
                            setDraftID={setDraftID}
                        />
                    }/>

                    <Route path="/companies" element={
                        <CompaniesList
                            setPage={() => addPage([homePage, companiesPage])}
                            draftID={draftID}
                            setDraftID={setDraftID}
                        />
                    }
                    />

                    <Route path="/request" element={
                        <RequestView
                            setPage={() => addPage([homePage, requestPage])}
                        />
                    }
                    />

                    <Route path="/add-company" element={
                        <CreateCompanyPage
                            setPage={() => addPage([homePage, addCompanyPage])}
                        />}
                    />

                    <Route path="/add-company-2" element={
                        <CreateCompanyPage
                            setPage={() => addPage([homePage, companiesTablePage, addCompanyPage])}
                        />}
                    />

                    <Route path="/login" element={<LoginPage/>}/>

                    <Route path="/companies/admin" element={
                        <CompanyTable
                            setPage={() => addPage([homePage, companiesTablePage])}
                        />}
                    />

                    <Route path="/register" element={<RegisterPage/>}/>

                    <Route path="/tenders/:tender_id" element={
                        <TenderCard setPage={
                            (id) => addPage([
                                homePage,
                                requestPage,
                                {name: `Тендер`, to: `tender/${id}`}
                            ])
                        }/>
                    }/>

                    <Route path="/companies/:id" element={
                        <CompanyDetail
                            setPage={(name, id) => addPage([
                                homePage,
                                companiesPage,
                                {name: `${name}`, to: `companies/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
