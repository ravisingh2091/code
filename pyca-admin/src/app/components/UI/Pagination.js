import React from 'react'

const Pagination = ({ totalData, currentPage, pageLinkClick }) => {
    const PER_PAGE = 10
    let pageCount = Math.ceil(totalData / PER_PAGE)


    let buttonList = []
    for (let i = 1; i <= pageCount; i++) {
        let className = currentPage === i ? "page-item active" : "page-item"
        buttonList.push(<li key={i} className={className}>
            <a className="page-link" href="#" onClick={() => pageLinkClick(i)}>{i}</a>
        </li>)
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
                {/* <li className="page-item disabled">
                    <a className="page-link" href="#" tabindex="-1">Previous</a>
                </li> */}
                {buttonList}
                {/* <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                </li> */}
            </ul>
        </nav>
    )

}

export default Pagination