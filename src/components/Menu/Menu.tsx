import {Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './Menu.css'
import {FC, useEffect} from "react";
//import {useAppDispatch} from "../../hooks/redux.ts";
import Cookies from "js-cookie";
//import {fetchCurrentTender} from "../../store/reducers/ActionCreator.ts";

interface MenuProps {
    setPage: () => void
}

const Menu: FC<MenuProps> = ({setPage}) => {
    //const dispatch = useAppDispatch()
    // const {draftID} = useAppSelector(state => state.companyReducer)
    // const navigate = useNavigate()
    const jwtToken = Cookies.get('jwtToken')
    const role = Cookies.get('role')

    useEffect(() => {
        setPage()
        //dispatch(fetchCurrentTender())
    }, []);

    if (!jwtToken) {
        return <>
            <Container className="text-center mt-5">
                <div className="menu rounded p-4">
                    <h2 className="mb-2">Меню</h2>
                    <div className="d-flex flex-column">
                        <Link to="/login" className="btn btn-outline-info my-2 rounded-pill">Войти</Link>
                        <Link to="/register"
                              className="btn btn-outline-info my-2 rounded-pill">Зарегестрироваться
                        </Link>
                    </div>
                </div>
            </Container>
        </>
    }

    return (
        <Container className="text-center mt-5">
            <div className="menu rounded p-4">
                <h2 className="mb-2">Меню</h2>
                <div className="d-flex flex-column">
                    <Link to="/companies" className="btn btn-outline-info my-2 rounded-pill">Компании</Link>
                    <Link to="/request" className="btn btn-outline-info my-2 rounded-pill">Список тендеров</Link>
                    {role == '2' && <Link to="/add-company" className="btn btn-outline-info my-2 rounded-pill">Создать компанию</Link>}
                    {role == '2' && <Link to="/companies/admin" className="btn btn-outline-info my-2 rounded-pill">Таблица компаний</Link>}
                    {/*<button*/}
                    {/*    className={`btn btn-outline-info my-2 rounded-pill ${draftID == 0 ? 'disabled' : ''}`}*/}
                    {/*    disabled={draftID == 0}*/}
                    {/*    onClick={() => navigate(`tenders/${draftID}`)}*/}
                    {/*>*/}
                    {/*    Черновик*/}
                    {/*</button>*/}
                </div>
            </div>
        </Container>
    );
};

export default Menu;
