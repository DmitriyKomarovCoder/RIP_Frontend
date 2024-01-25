import {FC, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {ICompany, mockCompanies} from '../../models/models.ts';
import './CompaniesCard.css'

interface CompanyDetailProps {
    setPage: (name: string, id: number) => void
}

const CompaniesDetail: FC<CompanyDetailProps> = ({setPage}) => {
    const params = useParams();
    const [company, setCompany] = useState<ICompany | null>(null);
    const navigate = useNavigate();

    const BackHandler = () => {
        navigate('/companies');
    }

    useEffect(() => {
        fetchCompany()
            .catch((err) => {
                console.error(err);
                const previewID = params.id !== undefined ? parseInt(params.id, 10) - 1 : 0;
                const mockCompany = mockCompanies[previewID]
                setPage(mockCompany.name ?? "Без названия", mockCompany.company_id)
                setCompany(mockCompany);
            });

    }, [params.id]);

    async function fetchCompany() {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/companies/${params.id}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPage(data.company?.name ?? "Без названия", data.company.company_id)
            setCompany(data.company);
        } catch (error) {
            console.error('Error fetching company data', error);
            throw error;
        }
    }


    if (!company) {
        return <div>Loading...</div>;
    }

    return (
        !company
            ? <div>Loading...</div>
            : <div className="company-card-body">
                <div className="card-container gray-text">
                    <img
                        className="round"
                        src={company?.image_url || '/RIP_Frontend/default.png'}
                        alt={company?.name}
                    />
                    <h3>{company?.name}</h3>
                    <h6>ИИН: {company?.iin}</h6>
                    <h6>Статус: {company?.status}</h6>
                    <p>{company?.description}</p>
                    <div className="buttons">
                        <button className="btn btn-danger" onClick={BackHandler}>Назад</button>
                    </div>
                </div>
            </div>
    );
};

export default CompaniesDetail;
