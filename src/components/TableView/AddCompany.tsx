import {useState, ChangeEvent, FormEvent, FC, useEffect} from 'react';
import {Button, Form, Container, Row, Col} from 'react-bootstrap';
import {createCompany} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import MyComponent from "../Popup/Popover.tsx";
import Cookies from "js-cookie";

interface CompanyData {
    companyName: string;
    description: string;
    image: File | null;
    iin: string
}

interface AddCompanyProps {
    setPage: () => void
}

const CreateCompanyPage: FC<AddCompanyProps> = ({setPage}) => {
    const [companyData, setCompanyData] = useState<CompanyData>({
        companyName: '',
        description: '',
        image: null,
        iin: '',
    });
    const {error, success} = useAppSelector(state => state.companyReducer)
    const role = Cookies.get('role')
    const dispatch = useAppDispatch()
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setCompanyData({...companyData, [name]: value});
    };

    useEffect(() => {
        setPage()
    }, []);

    const save = () => {
        dispatch(createCompany(companyData.companyName, companyData.description, companyData.iin, companyData.image))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            companyData.image = file
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Handle form submission logic, e.g., dispatching data to the server
        console.log('Company data submitted:', companyData);
    };

    if (role != '2') {
        return <h2>нет прав</h2>
    }
    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h2 style={{ color: 'black' }}>Добавление компании</h2>                        <Form
                        onSubmit={handleSubmit}>
                            <Form.Group controlId="formCompanyName">
                                <Form.Label style={{ color: 'black' }}>Название компании</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Название"
                                    name="companyName"
                                    value={companyData.companyName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCompanyIIN">
                                <Form.Label style={{ color: 'black' }}>ИИН</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Название"
                                    name="iin"
                                    value={companyData.iin}
                                    onChange={handleInputChange}
                                    required

                                />
                            </Form.Group>
                            <Form.Group controlId="formCityDescription">
                                <Form.Label style={{ color: 'black' }}>Описание компании</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Описание"
                                    name="description"
                                    value={companyData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formCompanyImage">
                                <Form.Label style={{ color: 'black' }}>Логотип компании</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>

                            <Button variant="danger" type="submit" style={{marginTop: '30px'}} onClick={save}>
                                Создать
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CreateCompanyPage;
