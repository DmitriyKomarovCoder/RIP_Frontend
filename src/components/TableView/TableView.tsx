import {FC} from "react";
import './TableView.css'
import {ICompanyTenders} from "../../models/models.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {deleteTenderById, updateTenderCompany} from "../../store/reducers/ActionCreator.ts";
import {companySlice} from "../../store/reducers/CompanySlice.ts";

interface TableViewProps {
    status: string
    companyTender: ICompanyTenders[]
}

const TableView: FC<TableViewProps> = ({companyTender, status}) => {
    const dispatch = useAppDispatch()
    const {minus} = companySlice.actions
    const {increase} = companySlice.actions
    const {cash} = useAppSelector(state => state.companyReducer)


    const handleDelete = (id: number) => {
        //dispatch(minus())
        dispatch(deleteTenderById(id))
    }

    const handleCashChangePlus = (id: number) => {
        dispatch(increase())
        dispatch(updateTenderCompany(id, cash))
    }

    const handleCashChangeMinus = (id: number) => {
        dispatch(minus())
        dispatch(updateTenderCompany(id, cash))
    }

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className="number">Цена</th>
                    <th>Логотип компании</th>
                    <th>Название Компании</th>
                    <th>Описание</th>
                    {status === "черновик" && <th>Действие</th>}
                </tr>
                </thead>
                <tbody>
                {companyTender.map((item, index) => (
                    <tr key={index}>
                        <td className="text-center">
                            {status == "черновик" && (
                                <>
                                    <button className="btn btn-sm btn-primary"
                                            onClick={() => handleCashChangeMinus(item.id)}>
                                        -
                                    </button>
                                    <span className="mx-2">{item.cash} руб.</span>
                                    <button className="btn btn-sm btn-primary"
                                            onClick={() => handleCashChangePlus(item.id)}>
                                        +
                                    </button>
                                </>
                            )}
                            {status != "черновик" && <span>{item.cash} руб.</span>}
                        </td>
                        <td className="image-td">
                            <img src={item.company.image_url} alt="photo" />
                        </td>
                        <td className="city-name-td">{item.company.name}</td>
                        <td>{item.company.description}</td>
                        {status === "черновик" && (
                            <td className="delete-td">
                                <img
                                    className="delete-button-td"
                                    src="/RIP_Front/dustbin.png"
                                    alt="Delete"
                                    onClick={() => handleDelete(item.id)}
                                />
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default TableView;
