import React from 'react';

import './ShopCart.scss';

const ShopCart = ({ list, removeProductFromCart, changeProductQuantity }) => {
    function handleRemoveClick({ target }) {
        removeProductFromCart({
            id: +target.closest('tr').id,
        });
    }

    function handleQuantityChange({ target }) {
        changeProductQuantity({
            id: +target.closest('tr').id,
            quantity: +target.value,
        });
    }

    if (list.length) {
        return (
            <table className="shop-cart-table">
                <thead>
                    <tr className="table_row">
                        <th className="table_row_cell table_row_cell--name">
                            Наименование товара и описание
                        </th>
                        <th className="table_row_cell table_row_cell--quantity">
                            Количество
                        </th>
                        <th className="table_row_cell table_row_cell--price" colSpan="2">
                            Цена
                        </th>
                    </tr>
                </thead>
                <tfoot>
                    <tr className="table_row">
                        <td className="table_row_cell" colSpan="2">Общая стоимость:</td>
                        <td className="table_row_cell" colSpan="2">
                            {list.reduce((totalCost, product) => +(totalCost + product.Pl * product.C).toFixed(2), 0)}
                            {' '}
                            руб
                        </td>
                    </tr>
                </tfoot>
                <tbody>
                    {list.map((product) => (
                        <tr key={product.T} id={product.T}>
                            <td className="table_row_cell table_row_cell--name">
                                {product.N}
                            </td>
                            <td className="table_row_cell table_row_cell--quantity">
                                <input type="number" value={product.Pl} min={1} onChange={handleQuantityChange} />
                            </td>
                            <td className="table_row_cell table_row_cell--price">
                                {product.C}
                                {' '}
                                руб/шт
                            </td>
                            <td className="table_row_cell table_row_cell--remove">
                                <button type="button" onClick={handleRemoveClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="svelte-c8tyih">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12
                                                12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12
                                                2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return <h1>Корзина пуста</h1>;
};

export default ShopCart;
