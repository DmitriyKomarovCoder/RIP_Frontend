import React, {FC, useEffect, useState} from "react";
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchTenders, fetchTendersFilter, moderatorUpdateStatus} from "../../store/reducers/ActionCreator.ts";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import "./DatePickerStyle.css";
import "./RequestView.css";
import {Form, Button, Container, Row, Col} from "react-bootstrap";
import {format} from "date-fns";
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import {ITender} from "../../models/models.ts";
import debounce from 'lodash/debounce';
import ru from 'date-fns/locale/ru';
import {searchSlice} from "../../store/reducers/SearchSlice.ts";

interface RequestViewProps {
    setPage: () => void;
}

registerLocale('ru', ru);

setDefaultLocale('ru');


const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {tender, error, success} = useAppSelector((state) => state.tenderReducer);
    const {isAuth} = useAppSelector((state) => state.userReducer);
    const {startDate, endDate, selectedStatus} = useAppSelector((state) => state.searchReducer);
    //const [startDate, setStartDate] = useState<Date | null>(null);
    //const [endDate, setEndDate] = useState<Date | null>(null);
    //const [selectedStatus, setSelectedStatus] = useState<string>('');
    const role = Cookies.get('role')
    const [filteredTenders, setFilteredTenders] = useState<ITender[] | null>(null);
    const [filteredByUsers, setFilteredUsers] = useState<ITender[] | null>(null);
    const [textValue, setTextValue] = useState<string>('');
    const jwtToken = Cookies.get('jwtToken')

    useEffect(() => {
        setPage();
        handleFilter()
        const debouncedHandleFilter = debounce(handleFilter, 1000);


        const handleFilterInterval = setInterval(() => {
            debouncedHandleFilter();
        }, 5000);


        const cleanup = () => {
            clearInterval(handleFilterInterval);
        };

        window.addEventListener('beforeunload', cleanup);

        return () => {
            cleanup();
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [startDate, endDate, selectedStatus]);

    const resetFilter = () => {
        dispatch(searchSlice.actions.reset())
        handleFilter()
    }

    const handleFilter = () => {
        const formatDate = (date: Date | null | undefined): string | undefined => {
            if (!date) {
                return undefined;
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const startDateObject = startDate ? new Date(startDate) : null;
        const endDateObject = endDate ? new Date(endDate) : null;

        const formattedStartDate = formatDate(startDateObject);
        const formattedEndDate = formatDate(endDateObject);

        if (role == '2') {
            dispatch(fetchTendersFilter(formattedStartDate, formattedEndDate, `${selectedStatus}`));
        } else {
            dispatch(fetchTenders)
            localFilter(formattedStartDate, formattedEndDate)
        }
    };

    function formatDate2(inputDate: string): string {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }

    const localFilter = (startDateString: string | undefined, endDateString: string | undefined) => {

        function isDateInRange(date: string): boolean {
            const bdDateString = formatDate2(date)
            const bdDate = new Date(bdDateString)
            const start = startDateString ? new Date(startDateString) : new Date('0001-01-01')
            const end = endDateString ? new Date(endDateString) : new Date('2033-12-21')
            return (!startDate || bdDate >= start) && (!endDate || bdDate <= end)
        }

        if (tender) {
            const d = tender.tenders.filter(obj => isDateInRange(obj.creation_date))
            setFilteredTenders(d)
        }
    }

    const clickCell = (cellID: number, event: React.MouseEvent<HTMLTableRowElement>) => {
        const isInsideButtons = event && (event.target as HTMLElement).closest('.my-3');
        if (!isInsideButtons) {
            if (!isInsideButtons) {
                navigate(`/tenders/${cellID}`);
            }
        }
    }

    if (jwtToken === "") {
        return (
            <Link to="/login" className="btn btn-outline-danger">
                Требуется войти в систему
            </Link>
        );
    }

    const handleInputChange = () => {
        if (tender) {
            const d = tender.tenders.filter(obj => obj.user_login === textValue)
            setFilteredUsers(d.length == 0 ? null : d)
        }
    };

    const handlerApprove = (id: number) => {
        dispatch(moderatorUpdateStatus(id, 'завершен'))
        //navigate(-1);
    }

    const handleDiscard = (id: number) => {
        dispatch(moderatorUpdateStatus(id, 'отклонен'))
        //navigate(-1);
    }

    return (
        <>
            {/* =================================== ALERTS ===========================================*/}

            {error !== "" && <MyComponent isError={true} message={error}/>}
            {success !== "" && <MyComponent isError={false} message={success}/>}

            {/* =================================== CHECK JWT TOKEN =====================================*/}
            {!isAuth ? (
                <Link to="/login" className="btn btn-outline-danger">
                    Требуется войти в систему
                </Link>
            ) : (
                <>
                    {/* =================================== FILTERS ======================================*/}

                    <Container>
                        <Row className="justify-content-center">
                            <Col md={3} className="mb-3 custom-col">
                                {role === '2' &&
                                    <Form.Group controlId="exampleForm.ControlInput1" className="custom-form">
                                        <Form.Label
                                            style={{ color: '#7B7D87', fontWeight: 'bold' }}
                                        >
                                            Фильтрация по пользователю
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Введите текст"
                                            value={textValue}
                                            onChange={(e) => setTextValue(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleInputChange();
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                }
                                <div className="filter-section d-flex flex-column">
                                    <label style={{color: '#7B7D87', fontWeight: 'bold'}}>Дата создания с:</label>
                                    <DatePicker
                                        selected={startDate ? new Date(startDate) : null}
                                        onChange={(date) => {
                                            if (date) {
                                                dispatch(searchSlice.actions.setDateStart(date.toISOString()));
                                            }
                                        }}
                                        className="custom-datepicker"
                                        popperPlacement="bottom-start"
                                    />

                                    <label style={{color: '#7B7D87', fontWeight: 'bold'}}>Дата окончания по:</label>
                                    <DatePicker
                                        selected={endDate ? new Date(endDate) : null}
                                        onChange={(date) => {
                                            if (date) {
                                                dispatch(searchSlice.actions.setDateEnd(date.toISOString()));
                                            }
                                        }}
                                        className="custom-datepicker"
                                        popperPlacement="bottom-start"
                                    />

                                    {role === '2' &&
                                        <>
                                            <label className="mb-2" style={{color: '#7B7D87', fontWeight: 'bold'}}>Статус
                                                тендера:</label>
                                            <Form.Select
                                                className='mb-2'
                                                value={selectedStatus || ""}
                                                onChange={(e) => dispatch(searchSlice.actions.setStatus(e.target.value))}
                                            >
                                                <option value="">Выберите статус</option>
                                                <option value="сформирован">Сформирован</option>
                                                <option value="завершен">Завершён</option>
                                                <option value="отклонен">Отклонён</option>
                                            </Form.Select>
                                        </>
                                    }

                                    <Button
                                        className='btn btn-danger mt-2'
                                        style={{ width: '100%' }}
                                        onClick={handleFilter}
                                    >
                                        Применить фильтры
                                    </Button>

                                    <Button
                                        className='btn btn-danger mt-2'
                                        style={{ width: '100%' }}
                                        onClick={resetFilter}
                                    >
                                        Сбросить фильтры
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>


                    {/* =================================== TABLE ADMIN =============================================*/}
                    {tender &&
                        <table className='table-tenders'>
                            <thead>
                            <tr>
                                {/*<th>ID</th>*/}
                                <th>Название тендера</th>
                                <th>Статус рассмотрения</th>
                                <th>Дата создания</th>
                                <th>Дата начала процесса</th>
                                <th>Дата принятия</th>
                                <th>Автор</th>
                                {role == '2' &&
                                    <th>Модератор</th>
                                }
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTenders && role == '0'
                                ? filteredTenders.map((tender) => (
                                    <tr key={tender.id}
                                        onClick={(event) => clickCell(tender.id, event)}>                                {/*<td>{tender.id}</td>*/}
                                        <td>{tender.tender_name || 'Не задано'}</td>
                                        <td>{tender.status_check || 'Не рассмотрен'}</td>
                                        <td>{checkData(tender.creation_date)}</td>
                                        <td>{checkData(tender.formation_date)}</td>
                                        <td>{checkData(tender.completion_date)}</td>
                                        <td>{tender.user_login || 'Не задан'}</td>
                                        <td>{tender.status}</td>
                                    </tr>
                                ))
                                : (filteredByUsers ? filteredByUsers : tender.tenders).map((tender) => (
                                    <tr key={tender.id} onClick={(event) => clickCell(tender.id, event)}>
                                        {/*<td>{tender.id}</td>*/}
                                        <td>{tender.tender_name || 'Не задано'}</td>
                                        <td>{tender.status_check || 'Не рассмотрен'}</td>
                                        <td>{checkData(tender.creation_date)}</td>
                                        <td>{checkData(tender.formation_date)}</td>
                                        <td>{checkData(tender.completion_date)}</td>
                                        <td>{tender.user_login || 'Не задан'}</td>
                                        {role == '2' &&
                                            <td>{tender.moderator_login || 'Не задан'}</td>
                                        }
                                        <td>{tender.status}</td>
                                        <td>
                                            {tender.status == 'сформирован' && role == '2' && (

                                                <div className='my-3'
                                                     style={{
                                                         display: 'flex',
                                                         flexDirection: 'column',
                                                         alignItems: 'center'
                                                     }}>
                                                    <Button variant="btn btn-danger"
                                                            onClick={() => handlerApprove(tender.id)}
                                                            className='mb-2'>
                                                        Завершить
                                                    </Button>

                                                    <Button variant="outline-danger"
                                                            onClick={() => handleDiscard(tender.id)}
                                                            style={{width: '100%'}}>
                                                        Отказать
                                                    </Button>
                                                </div>

                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </>
            )}
        </>
    );
}
export default RequestView;

function checkData(data: string): string {
    if (data == '0001-01-01T00:00:00Z') {
        return 'Дата не задана'
    }
    const formattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'dd.MM.yyyy');
    };

    const formatted = formattedDate(data);
    return formatted
}
