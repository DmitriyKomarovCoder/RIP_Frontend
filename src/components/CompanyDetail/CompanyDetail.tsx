import {FC, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './CompanyCard.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchCompany} from "../../store/reducers/ActionCreator.ts";

interface CompanyDetailProps {
    setPage: (name: string, id: number) => void
}

const CompanyDetail: FC<CompanyDetailProps> = ({setPage}) => {
    const params = useParams();
    const dispatch = useAppDispatch()
    const {company, isLoading, error} = useAppSelector(state => state.companyReducer)
    const navigate = useNavigate();

    // const handleDelete = () => {
    //     navigate('/companies');
    //     DeleteData()
    //         .then(() => {
    //             console.log(`Company with ID ${company?.company_id} successfully deleted.`);
    //         })
    //         .catch(error => {
    //             console.error(`Failed to delete company with ID ${company?.company_id}: ${error}`);
    //             navigate('/companies');
    //         });
    // }

    // const DeleteData = async () => {
    //     try {
    //         const response = await fetch('http://127.0.0.1:8080/api/companies/delete/' + company?.company_id, { // company_id
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //
    //         if (response.status === 200) {
    //             console.log('Компания успешно удалена');
    //             window.location.reload();
    //         } else {
    //             console.error('Произошла ошибка при удалении компании');
    //         }
    //
    //     } catch (error) {
    //         console.error('Произошла ошибка сети', error);
    //     }
    // }

    const BackHandler = () => {
        navigate('/companies');
    }

    useEffect(() => {
        dispatch(fetchCompany(`${params.id}`, setPage))
    }, [params.id]);

    return (
        <>
            {isLoading && <h1> Загрузка данных .... </h1>}
            {error && <h1>Ошибка {error} </h1>}
            {<div className="city-card-body">
                <div className="card-container">
                    <img
                        className="round"
                        src={company?.image_url}
                        alt={company?.name}
                    />
                    <h3>{company?.name}</h3>
                    <h6>ИИН: {company?.iin}</h6>
                    <h6>Статус: {company?.status}</h6>
                    <p>{company?.description}</p>
                    {/*<img*/}
                    {/*    className="delete-button"*/}
                    {/*    src="/RIP_Front/deleteTrash.png"*/}
                    {/*    alt="Delete"*/}
                    {/*    onClick={handleDelete}*/}
                    {/*/>*/}
                    <div className="buttons">
                        <button className="primary" onClick={BackHandler}>Назад</button>
                        {/*<button className="primary ghost">Записаться</button>*/}
                    </div>
                </div>
            </div>}
        </>
    );
};

export default CompanyDetail;
