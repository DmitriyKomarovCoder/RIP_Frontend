import {Link, useLocation} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import Cookies from "js-cookie";
import {userSlice} from "../../store/reducers/UserSlice.ts";
import './NavigationBar.css'
import {useNavigate} from 'react-router-dom';
import {FiLogOut, FiUserPlus} from 'react-icons/fi';
import { FiLogIn } from 'react-icons/fi';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import {searchSlice} from "../../store/reducers/SearchSlice.ts";
import {logoutSession} from "../../store/reducers/ActionCreator.ts";

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const dispatch = useAppDispatch()
    const {isLoading, success, error} = useAppSelector(state => state.userReducer)
    const role = Cookies.get('role')
    const jwtToken = Cookies.get('jwtToken')
    //const {draftID} = useAppSelector(state => state.companyReducer)
    //const navigate = useNavigate()
    const userName = Cookies.get('userName')

    const handleLogout = () => {
        console.log('tap')
        const jwtToken = Cookies.get('jwtToken');
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach(cookieName => {
            Cookies.remove(cookieName);
        });
        dispatch(userSlice.actions.setAuthStatus(false))
        dispatch(searchSlice.actions.reset())

        if (jwtToken) {
            dispatch(logoutSession(jwtToken));
        }
    };

    const handleLogin = () => {
        navigate("/login")
    }

    const handlRegister = () => {
        navigate("/register")
    }

    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <Navbar expand="sm" className="bg-white" data-bs-theme="dark">
                <div className="container-xl px-2 px-sm-3">
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto justify-content-center">
                            {role == '2' &&
                                <Nav.Item>
                                    <Link to="/companies/admin" className={`${isActive('/companies/admin') ? 'active-link' : 'custom-link'} ps-0}`}>
                                        Таблица компаний
                                    </Link>
                                </Nav.Item>
                            }
                            <Nav.Item className="mx-3">
                                <Link to="/companies" className={`${isActive('/companies') ? 'active-link' : 'custom-link'} ps-0}`}>
                                    Компании
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/request" className={`${isActive('/request') ? 'active-link' : 'custom-link'} ps-0}`} onClick={()=> navigate("/request")}>
                                    Список заявок
                                </Link>
                            </Nav.Item>
                        </Nav>
                        {jwtToken ? (
                            <>
                                <Nav>

                                    <Nav.Item className="mx-2">
                                        <span className="logout-text">Пользователь: {userName || 'Не задано'}</span>
                                    </Nav.Item>
                                    <Nav.Item className="mx-2">
                                        <a href="#" className="logout-link" onClick={handleLogout}>
                                            <FiLogOut className="logout-icon"/>
                                            <span className="logout-text">Выход</span>
                                        </a>
                                    </Nav.Item>
                                </Nav>
                            </>
                        ) : (
                            <>
                                <Nav className="ms-2">
                                    <Nav.Item className="mx-2">
                                        <a href="#" className="logout-link" onClick={handleLogin}>
                                            <FiLogIn className="logout-icon"/>
                                            <span className="logout-text">Войти</span>
                                        </a>
                                    </Nav.Item>
                                </Nav>
                                <Nav className="ms-2">
                                    <Nav.Item className="mx-2">
                                        <a href="#" className="logout-link" onClick={handlRegister}>
                                            <span className="logout-text">Регистрация </span>
                                            <FiUserPlus className="logout-icon"/>

                                        </a>
                                    </Nav.Item>
                                </Nav>
                            </>
                        )}
                    </Navbar.Collapse>
                </div>
            </Navbar>

            {isLoading && <LoadAnimation/>}
        </>
    );
};

export default NavigationBar;
