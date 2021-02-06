import React from 'react';

const ProductItem = ({ info, id }) => (
    <tr className="product-table_row" id={id}>
        <td className="product-table_row_cell">
            {info.N}
            (
            {info.P}
            )
        </td>
        <td className="product-table_row_cell">
            {info.C}
        </td>
    </tr>
);

export default ProductItem;
