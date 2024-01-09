import {FC} from "react";
import './TableView.css'
import {ICompanyTenders} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteTenderById, updateTenderCompany} from "../../store/reducers/ActionCreator.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
interface TableViewProps {
    status: string
    companyTender: ICompanyTenders[]
    setPage: (name: string, id: number) => void
    tenderID: string
}

const TableView: FC<TableViewProps> = ({companyTender, status, setPage, tenderID}) => {
    const dispatch = useAppDispatch()
    //const {minus} = companySlice.actions
    //const {increase} = companySlice.actions
    //const {reset} = companySlice.actions
   // const {cash} = useAppSelector(state => state.companyReducer)


    const handleDelete = (id: number) => {
        //dispatch(minus())
        dispatch(deleteTenderById(id, tenderID, setPage))
    }

    const handleCashChangePlus = (id: number, cash: number) => {
        cash += 1000
        //dispatch(increase())
        dispatch(updateTenderCompany(id, cash, tenderID, setPage))
    }

    const handleCashChangeMinus = (id: number, cash: number) => {
        cash = cash == 0 ? 0 : cash - 1000
        //dispatch(minus())
        dispatch(updateTenderCompany(id, cash, tenderID, setPage))
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
                </tr>
                </thead>
                <tbody>
                {companyTender.map((item, index) => (
                    <tr key={index}>
                        <td className="text-center">
                            {status == "черновик" && (
                                <>
                                    <button className="btn btn-sm btn-primary"
                                            onClick={() => handleCashChangeMinus(item.id, item.cash)}>
                                        -
                                    </button>
                                    <span className="mx-2">{item.cash} руб.</span>
                                    <button className="btn btn-sm btn-primary"
                                            onClick={() => handleCashChangePlus(item.id, item.cash)}>
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
                                <FontAwesomeIcon
                                    className="delete-button-td"
                                    icon={faTrash}
                                    onClick={() => handleDelete(item.id)}
                                    size="2x"
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
