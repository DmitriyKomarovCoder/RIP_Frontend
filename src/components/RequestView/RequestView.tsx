import './RequestView.css';
import {FC, useEffect, useState} from "react";
import TableView from "../TableView/TableView.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {
    // convertServerDateToInputFormat,
    deleteTender,
    emptyString,
    fetchTenders,
    makeTender,
    updateTender
} from "../../store/reducers/ActionCreator.ts";
import {ITender} from "../../models/models.ts";
import MyComponent from "../Popup/Popover.tsx";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import {Link} from "react-router-dom";

interface RequestViewProps {
    setPage: () => void;
}

const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const dispatch = useAppDispatch();
    const {tender, isLoading, error, success} = useAppSelector(state => state.tenderReducer);
    const {isAuth} = useAppSelector(state => state.userReducer);
    // const [startTenderDate, setStartTenderDate] = useState('');
    // const [endTenderDate, setEndTenderDate] = useState('');
    // const [leader, setLeader] = useState('$');
   // const [description, setDescription] = useState('$');
    const [tenderName, setTenderName] = useState('$');

    useEffect(() => {
        setPage();
        dispatch(fetchTenders());
    }, []);

    const handleDeleteTender = (id: number) => {
        dispatch(deleteTender(id))
    }

    const handleMakeRequest = () => {
        dispatch(makeTender())
    }

    const handleSave = (id: number, tender: ITender) => {
        dispatch(
            updateTender(
                id,
                tenderName == '$' ? tender.tender_name : tenderName,
                // startTenderDate == '$' ? tender.creation_date : startTenderDate,
                // endTenderDate == "" ? tender.completion_date : endTenderDate,
            )
        )
    }

    if (!isAuth) {
        return <Link to="/login" className="btn btn-outline-danger">
            Требуется войти в систему
        </Link>
    }

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            {tender && tender.tenders.length == 0 && <h1>Заявок нет</h1>}
            {tender &&
                tender.tenders.map((singleTender, index) => (
                    <div key={index} className='card-block'>
                        <div className="card">
                            <h3>Статус: {singleTender.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                    <div>
                                        <h4>Имя тендера: {emptyString(singleTender.tender_name, "Имя не задано")}</h4>
                                        <h4>Логин пользователя: {emptyString(singleTender.user.login, 'Логин на задан')}</h4>
                                    </div>
                                </div>

                                {/*<div className="dates-info">*/}
                                {/*    /!*<p>*!/*/}
                                {/*    /!*    Создание заявки:*!/*/}
                                {/*    /!*    <input*!/*/}
                                {/*    /!*        type="date"*!/*/}
                                {/*    /!*        className="form-control"*!/*/}
                                {/*    /!*        value={startTenderDate || convertServerDateToInputFormat(singleTender.creation_date)}*!/*/}
                                {/*    /!*        onChange={(e) => setStartHikeDate(e.target.value)}*!/*/}
                                {/*    /!*        disabled={singleHike.status_id == 2}*!/*/}
                                {/*    /!*    />*!/*/}
                                {/*    /!*</p>*!/*/}
                                {/*    /!*<p>*!/*/}
                                {/*    /!*    Завершение заявки:*!/*/}
                                {/*    /!*    <input*!/*/}
                                {/*    /!*        type="date"*!/*/}
                                {/*    /!*        className="form-control"*!/*/}
                                {/*    /!*        value={endTenderDate || convertServerDateToInputFormat(singleTender.date_end)}*!/*/}
                                {/*    /!*        onChange={(e) => setEndTenderDate(e.target.value)}*!/*/}
                                {/*    /!*        disabled={singleTender.status_id == 2}*!/*/}
                                {/*    /!*    />*!/*/}
                                {/*    /!*</p>*!/*/}
                                {/*</div>*/}

                            </div>
                            <div className="detail-info">
                                <input
                                    type="text"
                                    className="form-control bg-black text-white"
                                    value={tenderName == "$" ? singleTender.tender_name : tenderName}
                                    onChange={(e) => setTenderName(e.target.value)}
                                    style={{marginBottom: '20px'}}
                                    disabled={singleTender.status == "удален"}
                                />
                                {/*<textarea*/}
                                {/*    className="form-control description-text-info bg-black text-white"*/}
                                {/*    style={{height: "200px"}}*/}
                                {/*    value={description == "$" ? singleHike.description : description}*/}
                                {/*    onChange={(e) => setDescription(e.target.value)}*/}
                                {/*    disabled={singleHike.status_id == 2}*/}
                                {/*></textarea>*/}
                            </div>
                            <div style={{textAlign: 'right'}}>
                                {singleTender.status == "черновик" && <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => handleSave(singleTender.id, singleTender)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>
                        <TableView companyTender={singleTender.company_tenders} status={singleTender.status}/>
                        {
                            singleTender.status == "черновик" && (
                                <div className='delete-make'>
                                    <div style={{textAlign: 'left', flex: 1}}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => handleDeleteTender(singleTender.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                    <div style={{textAlign: 'right', flex: 1}}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-light"
                                            onClick={handleMakeRequest}
                                        >
                                            Сформировать
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ))}
        </>
    );
};

export default RequestView;