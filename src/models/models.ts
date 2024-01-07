export interface ICompanies {
    cities: ICompany[],
    status: string
}
export interface ICompanyResponse {
    company: ICompany,
    status: string
}

export interface ICompany {
    company_id: number,
    description: string,
    name: string,
    status: string,
    iin?: string,
    image_url?: string,
}

export interface ICompanyWithDraft { // ICityWithBasket
    draft_id: number,
    companies: ICompany[],
}

export interface ICompanyTenders { // IDestinationHikes
    id: number,
    company_id: number,
    tender_id: number,
    cash: number,
    company: ICompany,
}

export interface IRegisterResponse {
    login: string
    password: string
}

export interface IAuthResponse {
    access_token?: string,
    description?: string,
    status?: string,
}

export interface IUser {
    id: number,
    name: string,
    login: string,
    password: string,
}

export interface ITender { // IHike
    id: number,
    tender_name: string,
    creation_date: string,
    completion_date: string,
    formation_date: string,
    user_id: number,
    status: string,
    //creator_login: string,
    user: IUser,
    company_tenders: ICompanyTenders[],
}

export interface IRequest {
    tenders: ITender[]
    status: string
}

export interface ITenderResponse {
    tenders: ITender[]
    status: string
}

export interface IDeleteCompanyTender { // IDeleteDestinationHike
    deleted_company_tender: number, // company_tender
    status: string,
    description?: string,
}

export const mockCompanies: ICompany[] = [
    {
        company_id: 1,
        description: "Лидер в производстве автозапчастей для легковых автомобилей. Специализируется на тормозных системах и фильтрах.",
        name: "Авто-Про",
        status: "действует",
        iin: "12345678901",
        image_url: " /RIP_Front/imag4.png",
    },
    {
        company_id: 2,
        description: "Мировой поставщик качественных двигателей для грузовых автомобилей. В основном занимается производством дизельных моторов.",
        name: "ГрузМотор",
        status: "действует",
        iin: "98765432109",
        image_url: "/RIP_Front/img2.png",
    },
    {
        company_id: 3,
        description: "Специализированный магазин автозапчастей для ретро-автомобилей. Предлагает уникальные и редкие детали.",
        name: "Ретро-Запчасти",
        status: "действует",
        iin: "98765432109",
        image_url: "/RIP_Front/img1.png",
    },
    {
        company_id: 4,
        description: "Мировой лидер в разработке инновационных технологий для электромобилей. Специализируется на батарейных системах и зарядных устройствах.",
        name: "Эко-Мобиль",
        status: "действует",
        iin: "56789012345",
        image_url:"/RIP_Front/img3.jpg" // "/RIP_Frontend/img3.jpg",
    },
];