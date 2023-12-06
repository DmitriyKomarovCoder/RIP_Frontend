import {FC} from 'react';
import {ICompany} from '../../models/models.ts';
import './CardItem.css'


interface CompanyItemProps {
    company: ICompany;
    onClick: (num: number) => void,
    isServer: boolean
    reloadPage: () => void
}

const CompanyItem: FC<CompanyItemProps> = ({company, onClick, isServer, reloadPage}) => {
    const deleteClickHandler = () => {
        DeleteData()
            .then(() => {
                console.log(`Company with ID ${company.company_id} successfully deleted.`);
            })
            .catch(error => {
                alert(`Failed to delete company with ID ${company.company_id}: ${error}`)
            });
    }

    const DeleteData = async () => {
        const response = await fetch('http://0.0.0.0:8080/api/companies/' + company.company_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',

            },
        });
        if (response.status === 200) {
            reloadPage()
            return
        }
        throw new Error(`status code = ${response.status}`);
    }

    return (
        <div className="card-company-item" data-autopart-id={company.company_id}>
            <div>
                <img
                    src={company?.image_url || '/default.png'}
                    alt="Image"
                    className="photo"
                    onClick={() => onClick(company.company_id)}
                    id={`photo-${company.company_id}`}
                />
                {isServer && (
                    <div className="circle" onClick={deleteClickHandler}>
                        <img
                            src="/RIP_Frontend/deleteTrash.png"
                            alt="Del"
                            className="deleted-trash"
                        />
                    </div>
                )}
            </div>
            <div className="container-card" onClick={() => onClick(company.company_id)}> {company.name} </div>
        </div>
    );
};

export default CompanyItem;
