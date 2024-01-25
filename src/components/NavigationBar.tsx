import {Link} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {FC} from "react";
import './NavigationBar.css'

interface NavigationBarProps {
}

const NavigationBar: FC<NavigationBarProps> = ({}) => {

    return (
        <Navbar expand="sm" className="bg-white" data-bs-theme="dark">
            <div className='container-xl px-2 px-sm-3'>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto justify-content-center">
                        <Nav.Item>
                            <Link to="/companies" className="custom-link ps-0">Компании</Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}
export default NavigationBar;
