import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {ICompany, mockCompanies} from "../../models/models.ts";
import List from "../List.tsx";
import CompanyItem from "../CompanyItem/CompanyItem.tsx";
import './CompaniesList.css'

interface CompanyListProps {
    setPage: () => void
    searchValue?: string
    resetSearchValue: () => void;
}

const CompaniesList: FC<CompanyListProps> = ({setPage, searchValue, resetSearchValue}) => {
    const [Companies, setCompanies] = useState<ICompany[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setPage()
        if (!reloadPage) {
            fetchCompanies().catch((err) => {
                console.log(err)
                filterMockData()
            });
        }
    }, [searchValue, reloadPage]);

    useEffect(() => {
        if (reloadPage) {
            setReloadPage(false);
        }
    }, [reloadPage]);

    const fetchCompanies = async () => {
        const url = 'http://0.0.0.0:8080/api/companies' + `?company_name=${searchValue ?? ''}`;

        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(1000)
        })

        if (!response.ok) {
            setServerStatus(false)
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //console.log(data)
        setServerStatus(true)
        if (!data.companies.companies_list || data.companies.companies_list.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нет")
            resetSearchValue()
        }
        setCompanies(data.companies.companies_list ?? []);
    }

    const filterMockData = () => {
        if (searchValue) {
            const filteredCompanies = mockCompanies.filter(company =>
                company.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
            );
            if (filteredCompanies.length === 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                document.getElementById('search-text-field').value = ""
                alert("Данных нет")
                resetSearchValue()
            }
            setCompanies(filteredCompanies);
        } else {
            setCompanies(mockCompanies);
        }
    }

    return (
        <List items={Companies} renderItem={(company: ICompany) =>
            <CompanyItem
                key={company.company_id}
                company={company}
                isServer={serverIsWork}
                onClick={(num) => navigate(`/companies/${num}`)}
                reloadPage={() => {
                    setReloadPage(true)
                }}
            />
        }
        />
    );
};

export default CompaniesList;
