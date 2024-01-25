import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import CompaniesList from "./components/CompaniesList/CompaniesList.tsx";
import CompaniesDetail from "./components/CompaniesDetail/CompaniesDetails.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";


function App() {
    const CompaniesPage = {name: 'Компании', to: 'companies'};
    const [searchValue, setSearchValue] = useState('')
    const [pages, setPage] = useState<IBreadCrumb[]>([CompaniesPage])
    const addPage = (newPage: IBreadCrumb[]) => {
        setPage(newPage);
    };
    const resetSearchValue = () => {
        setSearchValue('');
    };

    return (
        <>
            <NavigationBar/>
            <BreadCrumbs pages={pages}/>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="companies"/>}/>
                    <Route path="/companies"
                           element={
                               <CompaniesList
                                   setPage={() => addPage([CompaniesPage])}
                                   searchValue={searchValue}
                                   resetSearchValue={resetSearchValue}
                                   handleSearchValue={(value) => setSearchValue(value)}
                               />
                           }
                    />
                    <Route path="/companies/:id" element={
                        <CompaniesDetail
                            setPage={(name, id) => addPage([
                                CompaniesPage, {name: `${name}`, to: `companies/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
