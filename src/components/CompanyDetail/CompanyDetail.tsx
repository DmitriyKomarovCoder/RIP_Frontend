import {FC, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './CompanyCard.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchCompany} from "../../store/reducers/ActionCreator.ts";
// import Cookies from "js-cookie";
// import {faTrash} from "@fortawesome/free-solid-svg-icons";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface CompanyDetailProps {
    setPage: (name: string, id: number) => void
}

const CompanyDetail: FC<CompanyDetailProps> = ({setPage}) => {
    const params = useParams();
    const dispatch = useAppDispatch()
    const {company, isLoading, error} = useAppSelector(state => state.companyReducer)
    const navigate = useNavigate();
    //const role = Cookies.get('role')

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
            {<div className="company-card-body">
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
                    {/*{role == '2' &&*/}
                    {/*<FontAwesomeIcon*/}
                    {/*    className="delete-button-td"*/}
                    {/*    icon={faTrash}*/}
                    {/*    onClick={handleDelete}*/}
                    {/*    size="1x"*/}
                    {/*/>*/}
                    {/*}*/}
                    <div className="buttons">
                        <button className="btn btn-primary" onClick={BackHandler}>Назад</button>
                        {/*<button className="primary ghost">Записаться</button>*/}
                    </div>
                </div>
            </div>}
        </>
    );
};

export default CompanyDetail;
