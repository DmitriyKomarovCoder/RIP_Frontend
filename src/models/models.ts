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

export interface ICompanyWithDraft {
    draft_id: number,
    companies: ICompany[],
}

export interface IDefaultResponse {
    description?: string
}

export interface ICompanyTenders {
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
    role?: string
    userName: string,
    userImage: string
}

export interface UserInfo {
    name: string,
    image: string,
}

export interface IUser {
    id: number,
    name: string,
    login: string,
    password: string,
}

export interface ITender {
    id: number,
    tender_name: string,
    creation_date: string,
    completion_date: string,
    formation_date: string,
    //user_id: number,
    status: string,
    status_check: string,
    user_name: string,
    moderator_name: string,
    user_login: string,
    moderator_login: string,
    //creator_login: string,
    //user: IUser,
    //moderator: IUser
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

export interface IDeleteCompanyTender {
    deleted_company_tender: number,
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
        image_url: "/RIP_Frontend/imag4.png",
    },
    {
        company_id: 2,
        description: "Мировой поставщик качественных двигателей для грузовых автомобилей. В основном занимается производством дизельных моторов.",
        name: "ГрузМотор",
        status: "действует",
        iin: "98765432109",
        image_url: "/RIP_Frontend/img2.png",
    },
    {
        company_id: 3,
        description: "Специализированный магазин автозапчастей для ретро-автомобилей. Предлагает уникальные и редкие детали.",
        name: "Ретро-Запчасти",
        status: "действует",
        iin: "98765432109",
        image_url: "/RIP_Frontend/img1.png",
    },
    {
        company_id: 4,
        description: "Мировой лидер в разработке инновационных технологий для электромобилей. Специализируется на батарейных системах и зарядных устройствах.",
        name: "Эко-Мобиль",
        status: "действует",
        iin: "56789012345",
        image_url:"/RIP_Frontend/img3.jpg" // "/RIP_Frontend/img3.jpg",
    },
];