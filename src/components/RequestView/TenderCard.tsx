import {FC, useEffect, useState} from 'react';
import {
    // convertServerDateToInputFormat,
    DateFormat,
    deleteTender,
    emptyString, fetchTenderById,
    makeTender,
    // moderatorUpdateStatus,
    updateTender
} from '../../store/reducers/ActionCreator';
import TableView from '../TableView/TableView.tsx';
import {ITender} from '../../models/models.ts';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import Cookies from "js-cookie";
import {useNavigate, useParams} from "react-router-dom";
import MyComponent from "../Popup/Popover.tsx";

interface TenderCardProps {
    setPage: (name: string, id: number) => void
}


const TenderCard: FC<TenderCardProps> = ({setPage}) => {
    const {tender_id} = useParams();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const {singleTender, success, error} = useAppSelector(state => state.tenderReducer)
    //const [startTenderDate, setStartTenderDate] = useState('');
    //const [endTenderDate, setEndTenderDate] = useState('');
    // const [leader, setLeader] = useState('$');
    //const [description, setDescription] = useState('$');
    const [tenderName, setTenderName] = useState('$');
    const role = Cookies.get('role')

    useEffect(() => {
        if (tender_id) {
            dispatch(fetchTenderById(tender_id, setPage))
        }
    }, []);

    const handleDeleteTender = (id: number) => {
        dispatch(deleteTender(id))
        navigate(-1);
    }

    // const handlerApprove = () => {
    //     if (singleTender) {
    //         dispatch(moderatorUpdateStatus(singleTender.id, 'завершен'))
    //         navigate(-1);
    //     }
    // }
    //
    // const handleDiscard = () => {
    //     if (singleTender) {
    //         dispatch(moderatorUpdateStatus(singleTender.id, 'отклонен'))
    //         navigate(-1);
    //     }
    // }
    //
    const handleMakeRequest = (id: number) => {
        dispatch(makeTender(id))
        navigate("/request");
    }

    const handleSave = (id: number, tender: ITender) => {
        dispatch(
            updateTender(
                id,
                tenderName == '$' ? tender.tender_name : tenderName,
            )
        )
    }

    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <div className='mx-5 mb-5'>
                {
                    singleTender && <>
                        {/* ======================= ШАПКА =============================== */}

                        <div className="card">
                            <h3>Статус: {singleTender.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                        <h4>Имя: {emptyString(singleTender.user_name, "Имя не задано")}</h4>
                                        <h4>Логин: {emptyString(singleTender.user_login, 'Логин на задан')}</h4>
                                </div>

                            </div>
                            <div className="detail-info">
                                {singleTender.status !="черновик" && <label>Сформирована: {DateFormat(singleTender.formation_date)}</label>}
                                <label htmlFor="tenderNameInput" style={{ color: 'white' }}>
                                    <h4 style={{textAlign: 'left'}}>Название тендера:</h4>
                                </label>
                                <input
                                    type="text"
                                    id="tenderNameInput"
                                    className="form-control bg-black text-white"
                                    value={tenderName === "$" ? singleTender.tender_name : tenderName}
                                    onChange={(e) => setTenderName(e.target.value)}
                                    style={{ marginBottom: '20px' }}
                                    disabled={singleTender.status !== 'черновик'}
                                />

                            </div>
                            <div style={{textAlign: 'right'}}>
                                {singleTender.status == 'черновик' && <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => handleSave(singleTender.id, singleTender)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>

                        {/* ======================= ТАБЛИЦА ============================= */}

                        <TableView
                            setPage={setPage}
                            tenderID={tender_id ?? ''}
                            companyTender={singleTender.company_tenders}
                            status={singleTender.status}
                        />

                        {/* ======================= КНОПКИ ============================= */}

                        <div className='delete-make' style={{display: 'flex', gap: '10px'}}>
                            {singleTender.status != 'удален' && singleTender.status == 'черновик' && role == '0' && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDeleteTender(singleTender.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            )}

                            {singleTender.status == 'черновик' && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light"
                                        onClick={() => handleMakeRequest(singleTender.id)}
                                    >
                                        Сформировать
                                    </button>
                                </div>
                            )}

                            {/*{singleTender.status == 'сформирован' && role == '2' && (*/}
                            {/*    <>*/}
                            {/*        <div style={{flex: 1}}>*/}
                            {/*            <button*/}
                            {/*                type="button"*/}
                            {/*                className="btn btn-outline-danger"*/}
                            {/*                onClick={() => handleDiscard()}*/}
                            {/*            >*/}
                            {/*                Отказать*/}
                            {/*            </button>*/}
                            {/*        </div>*/}

                            {/*        <div style={{flex: 1}}>*/}
                            {/*            <button*/}
                            {/*                type="button"*/}
                            {/*                className="btn btn-outline-light"*/}
                            {/*                onClick={handlerApprove}*/}
                            {/*            >*/}
                            {/*                Завершить*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    </>*/}
                            {/*)}*/}
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default TenderCard;
