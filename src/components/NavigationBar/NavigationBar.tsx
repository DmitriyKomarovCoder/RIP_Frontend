import {Link} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import LoadAnimation from "../Popup/MyLoaderComponents.tsx";
import MyComponent from "../Popup/Popover.tsx";
import Cookies from "js-cookie";
import {userSlice} from "../../store/reducers/UserSlice.ts";
import './NavigationBar.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import {FormLabel} from "react-bootstrap";
import {searchSlice} from "../../store/reducers/SearchSlice.ts";

const NavigationBar = () => {
    const dispatch = useAppDispatch()
    const {isLoading, success, error} = useAppSelector(state => state.userReducer)
    const role = Cookies.get('role')
    const jwtToken = Cookies.get('jwtToken')
    //const {draftID} = useAppSelector(state => state.companyReducer)
    //const navigate = useNavigate()
    const userName = Cookies.get('userName')

    const handleLogout = () => {
        console.log('tap')
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach(cookieName => {
            Cookies.remove(cookieName);
        });
        dispatch(userSlice.actions.setAuthStatus(false))
        dispatch(searchSlice.actions.reset())
        // dispatch(logoutSession())
    };

    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <Navbar expand="sm" className="bg-black" data-bs-theme="dark">
                <div className="container-xl px-2 px-sm-3">
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/* <Nav.Item className="mx-3">
                                <Link to="/" className="nav-link ps-0 text-info">
                                    Меню
                                </Link>
                            </Nav.Item> */}
                            {role == '2' &&

                                <Nav.Item>
                                    <Link to="/companies/admin" className="nav-link ps-0">
                                        Таблица компаний
                                    </Link>
                                </Nav.Item>
                            }
                            <Nav.Item className="mx-3">
                                <Link to="/companies" className="nav-link ps-0">
                                    Компании
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/request" className="nav-link">
                                    Список заявок
                                </Link>
                            </Nav.Item>
                        </Nav>
                            {/*<Form onSubmit={handleSearch} className="d-flex">*/}
                            {/*    <FormControl*/}
                            {/*        id={'search-text-field'}*/}
                            {/*        type="text"*/}
                            {/*        name="search"*/}
                            {/*        placeholder="Поиск компаний"*/}
                            {/*        className="me-2"*/}
                            {/*        aria-label="Search"*/}
                            {/*    />*/}

                            {/*    <Button type="submit" variant="outline-light">*/}
                            {/*        Поиск*/}
                            {/*    </Button>*/}

                            {/*</Form>*/}
                        {jwtToken ? (
                            <>

                                <Nav>
                                    <Nav.Item className="mx-2">
                                        <Button variant="outline-light" onClick={handleLogout}>
                                            Выйти
                                        </Button>
                                    </Nav.Item>
                                </Nav>
                                <Nav>
                                    {/*<Nav.Item className="mx-2">*/}
                                    {/*    <FontAwesomeIcon*/}
                                    {/*        icon={faShoppingCart}*/}
                                    {/*        className={`my-2 mr-2 ${draftID === 0 ? 'disabled' : ''}`}*/}
                                    {/*        onClick={() => draftID !== 0 && navigate(`tenders/${draftID}`)}*/}
                                    {/*        style={{*/}
                                    {/*            cursor: draftID === 0 ? 'not-allowed' : 'pointer',*/}
                                    {/*            fontSize: draftID === 0 ? '1.5em' : '2em', // Измените размер в зависимости от условия*/}
                                    {/*            color: draftID === 0 ? '#777777' : 'white', // Измените цвет в зависимости от условия*/}
                                    {/*            transition: 'color 0.3s ease', // Добавьте плавный переход цвета*/}
                                    {/*        }}*/}
                                    {/*    />*/}
                                    {/*</Nav.Item>*/}
                                </Nav>
                                <div className="avatar-container d-flex align-items-center">
                                    <Nav.Item className="mx-2 mt-2">
                                        <FormLabel>{userName || 'Не задано'}</FormLabel>
                                    </Nav.Item>
                                </div>
                            </>
                        ) : (
                            <>
                                <Nav className="ms-2">
                                    <Nav.Item>
                                        <Link to="/login" className="btn btn-outline-light">
                                            Войти
                                        </Link>
                                    </Nav.Item>
                                </Nav>
                                <Nav className="ms-2">
                                    <Nav.Item>
                                        <Link to="/register" className="btn btn-outline-info">
                                            Регистрация
                                        </Link>
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
