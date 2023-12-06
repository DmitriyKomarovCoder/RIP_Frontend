import {Link} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import React, {FC} from "react";

interface NavigationBarProps {
    handleSearchValue: (value: string) => void
}

const NavigationBar: FC<NavigationBarProps> = ({handleSearchValue}) => {

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputValue = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
        handleSearchValue(inputValue);
    };

    return (
        <Navbar expand="sm" style={{ backgroundColor: '#6e608d' }}>
            <div className='container-xl px-4 px-sm-4'>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Item>
                            <Link to="/сompanies" className="nav-link ps-0">Компании</Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link to="/сompanies" className="nav-link">Тендеры</Link>
                        </Nav.Item>
                    </Nav>
                    <div className='container-xl px-4 px-sm-4'>
                        <div className='mx-auto d-flex w-100'>
                            <Form onSubmit={handleSearch} className="d-flex align-items-center w-100">
                                <FormControl
                                    id={'search-text-field'}
                                    type="text"
                                    name="search"
                                    placeholder="Название компании"
                                    className="me-2 w-100"
                                    aria-label="Search"
                                />
                                <Button type="submit" variant="outline-light">Поиск</Button>
                            </Form>
                        </div>
                    </div>
                </Navbar.Collapse>
            </div>
        </Navbar>

    );
}

export default NavigationBar;
