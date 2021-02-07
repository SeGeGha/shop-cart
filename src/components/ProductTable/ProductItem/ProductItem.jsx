import React, { useEffect, useRef } from 'react';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const ProductItem = ({ info, id }) => {
    const prevProductCost = usePrevious(info.C);
    const ceilHighlight = (info.C > prevProductCost) ? 'red' : 'green';

    return (
        <tr className="product-table_row" id={id}>
            <td className="product-table_row_cell">
                {info.N}
                (
                {info.P}
                )
            </td>
            <td className={`product-table_row_cell product-table_row_cell--${ceilHighlight}-highlight`}>
                {info.C}
            </td>
        </tr>
    );
};

export default ProductItem;
