import React from 'react'
import { Link } from "react-router-dom";

const MemberListTdTr = ({ value, srNumber, page, showModel }) => {
    let status = null
    let action = null
    switch (page) {
        case 'list':
            status = value.status == '1' ? <span className="green">Active</span> : <span className="red">Inactive</span>
            action = (
                <td>
                    {value.status == '1' ? <span title="Block the user" onClick={() => showModel(value._id, '0')} className="Red" >
                        <i className="fa fa-ban"></i>
                    </span>
                        : <span title="Unblock the user" onClick={() => showModel(value._id, '1')} className="Green"><i className="fa fa-check"></i></span>}
                    <Link title="View user" to={"/member_details/" + value._id} className="Blue">
                        <i className="fa fa-eye"></i>
                    </Link>
                </td>
            )
            break;
        case 'approve':
            status = <span className="blue">Approve</span>
            action = (
                <td>
                    <span title="Unapprove the user" onClick={() => showModel(value._id)} className="Red"  ><i className="fa fa-ban"></i></span>
                    <Link title="View user" to={"/member_details/" + value._id} className="Blue">
                        <i className="fa fa-eye"></i>
                    </Link>
                </td>
            )
            break;
        case 'pending':
            status = <span className="red">Pending</span>
            action = (
                <td>
                    <span title="Approve the user" onClick={() => showModel(value._id)} className="Green"><i className="fa fa-check"></i></span>
                    <Link title="View user" to={"/member_details/" + value._id} className="Blue">
                        <i className="fa fa-eye"></i>
                    </Link>
                </td>
            )
            break;
        case 'block':
            status = <span className="red">Blocked</span>
            action = (
                <td>
                    <span title="Unblock the user" className="Green" onClick={() => showModel(value._id)} ><i className="fa fa-check"></i></span>
                    <Link title="View user" to={"/member_details/" + value._id} className="Blue">
                        <i className="fa fa-eye"></i>
                    </Link>
                </td>
            )
            break;

    }

    return (<tr>
        <td>{srNumber}</td>
        <td><img src={value.image} /></td>
        <td>{value.name}</td>
        <td>{value.email ?? ''}</td>
        <td>{value.phone}</td>
        <td>{value.vehicleNumber.toUpperCase()}</td>
        <td>{status}</td>
        {action}
    </tr>);
}


export default MemberListTdTr