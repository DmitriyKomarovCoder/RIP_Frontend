import {FC} from 'react';
import {ICompany} from '../../models/models.ts';
import './CardItem.css'
import {addCompanyIntoTender} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
//import {companySlice} from "../../store/reducers/CompanySlice.ts";


interface CompanyItemProps {
    company: ICompany;
    onClick: (num: number) => void,
    isServer: boolean
}

const CompanyItem: FC<CompanyItemProps> = ({company, onClick, isServer}) => {

    const dispatch = useAppDispatch()
    //const {increase} = companySlice.actions
    //const {cash} = useAppSelector(state => state.companyReducer)

    const plusClickHandler = () => {
        //dispatch(increase())
        dispatch(addCompanyIntoTender(company.company_id, 0.0, company.name ?? "Без названия"))
    }

    return (
        <div className="card-city-item" data-city-id={company.company_id}>
            <img
                src={company.image_url}
                alt="Image"
                className="photo"
                onClick={() => onClick(company.company_id)}
                id={`photo-${company.company_id}`}
            />
            {isServer && (
                <FontAwesomeIcon
                    className="circle"
                    icon={faPlus}
                    onClick={() => plusClickHandler()}
                    size="1x"
                />
            )}
            <div className="container-card" onClick={() => onClick(company.company_id)}>{company.name}</div>
            {/*<div className="container-card" onClick={plusClickHandler}></div>*/}

        </div>
    );
};

export default CompanyItem;
