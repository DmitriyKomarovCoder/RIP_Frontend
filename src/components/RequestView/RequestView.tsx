import {FC, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchTenders, fetchTendersFilter} from "../../store/reducers/ActionCreator.ts";
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
interface RequestViewProps {
    setPage: () => void;
}

const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {tender, error, success} = useAppSelector((state) => state.tenderReducer);
    const {isAuth} = useAppSelector((state) => state.userReducer);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const role = Cookies.get('role')
    const [filteredTenders, setFilteredTenders] = useState<ITender[] | null>(null);
    const [filteredByUsers, setFilteredUsers] = useState<ITender[] | null>(null);
    const [textValue, setTextValue] = useState<string>('');

    useEffect(() => {
        setPage();
        dispatch(fetchTenders());

        const debouncedHandleFilter = debounce(handleFilter, 1000); // Настройте время задержки по своему усмотрению


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
        setStartDate(null)
        setEndDate(null)
        setSelectedStatus('')
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
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        if (role == '2') {
            dispatch(fetchTendersFilter(formattedStartDate, formattedEndDate, `${selectedStatus}`));
        } else {
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

    const clickCell = (cellID: number) => {
        navigate(`/tenders/${cellID}`);
    }

    if (!isAuth) {
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

    return (
        <>
            {/* =================================== ALERTS ===========================================*/}

            {error !== "" && <MyComponent isError={true} message={error} />}
            {success !== "" && <MyComponent isError={false} message={success} />}

            {/* =================================== FILTERS ======================================*/}

            <Container>
                <Row className="justify-content-center">
                    <Col md={3} className="mb-3 custom-col">
                        {role === '2' &&
                            <Form.Group controlId="exampleForm.ControlInput1" className="custom-form">
                                <Form.Label className="text-start">Фильтрация по пользователю</Form.Label>
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
                            <label>Дата создания с:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="custom-datepicker"
                                popperPlacement="bottom-start"
                            />

                            <label>Дата окончания по:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="custom-datepicker"
                                popperPlacement="bottom-start"
                            />

                            {role === '2' &&
                                <>
                                    <label className="mb-2">Статус тендера:</label>
                                    <Form.Select
                                        className='mb-2'
                                        value={selectedStatus || ""}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="">Выберите статус</option>
                                        <option value="сформирован">Сформирован</option>
                                        <option value="завершен">Завершён</option>
                                        <option value="отклонен">Отклонён</option>
                                    </Form.Select>
                                </>
                            }

                            <Button style={{ width: '100%' }} className='mt-2' onClick={handleFilter}>Применить фильтры</Button>
                            <Button variant="outline-danger" style={{ width: '100%' }} className='mt-2' onClick={resetFilter}>Сбросить фильтры</Button>
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
                            <tr key={tender.id} onClick={() => clickCell(tender.id)}>
                                {/*<td>{tender.id}</td>*/}
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
                            <tr key={tender.id} onClick={() => clickCell(tender.id)}>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
};

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
