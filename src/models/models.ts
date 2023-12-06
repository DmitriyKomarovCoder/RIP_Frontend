export interface ICompaniesResponse {
    companies: ICompaniesResponseCompanies,
    status: string,
}

export interface ICompaniesResponseCompanies {
    draft_id: number,
    companies_list: ICompany[],
}

export interface ICompaniesResponseCompany {
    company: ICompany,
    status: string,
}

export interface ICompanyResponse {
    company: ICompany,
    status: string
}

export interface IStatus {
    id: number,
    status_name: string,
}

export interface ICompany {
    company_id: number,
    description: string,
    name: string,
    status: string,
    iin?: string,
    image_url?: string,
}

export const mockCompanies: ICompany[] = [
    {
        company_id: 1,
        description: "Лидер в производстве автозапчастей для легковых автомобилей. Специализируется на тормозных системах и фильтрах.",
        name: "Авто-Про",
        status: "действует",
        iin: "12345678901",
        image_url: " /RIP_Frontend/imag4.png",
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
        image_url: " /RIP_Frontend/img1.png",
    },
    {
        company_id: 4,
        description: "Мировой лидер в разработке инновационных технологий для электромобилей. Специализируется на батарейных системах и зарядных устройствах.",
        name: "Эко-Мобиль",
        status: "действует",
        iin: "56789012345",
        image_url: "/RIP_Frontend/img3.jpg",
    },
];
