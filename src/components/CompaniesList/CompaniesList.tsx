import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {ICompany, mockCompanies} from "../../models/models.ts";
import List from "../List.tsx";
import CompanyItem from "../CompanyItem/CompanyItem.tsx";
import './CompaniesList.css'
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface CompanyListProps {
    setPage: () => void
    searchValue?: string
    handleSearchValue: (value: string) => void
    resetSearchValue: () => void;
}

const CompaniesList: FC<CompanyListProps> = ({setPage, searchValue, resetSearchValue, handleSearchValue}) => {
    const [Companies, setCompanies] = useState<ICompany[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputValue = (document.getElementById('search-text-field') as HTMLInputElement)?.value;        console.log(inputValue)
        handleSearchValue(inputValue);
    };

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
        const url = 'http://127.0.0.1:8080/api/companies' + `?company_name=${searchValue ?? ''}`;

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

        <div className='mx-auto d-flex flex-column w-100'>
            {/* Поиск */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
                <Form onSubmit={handleSearch} className="d-flex">
                    <div className="d-flex align-items-center"> {/* Обертка для создания отступа слева */}
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="me-2"
                            style={{ fontSize: '1.5em', color: '#777777' }}
                        />
                        <FormControl
                            id={'search-text-field'}
                            type="text"
                            placeholder="Поиск компаний"
                            aria-label="Search"
                        />
                        <Button type="submit" className="ms-2 btn btn-danger">
                            Поиск
                        </Button>
                    </div>
                </Form>
            </div>

            <List items={Companies} renderItem={(company: ICompany) => (
                <CompanyItem
                    key={company.company_id}
                    company={company}
                    isServer={serverIsWork}
                    onClick={(num) => navigate(`/companies/${num}`)}
                    reloadPage={() => {
                        setReloadPage(true)
                    }}
                />
                )}
            />
        </div>

    );
};

export default CompaniesList;
