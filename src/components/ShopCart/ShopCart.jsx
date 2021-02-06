import React from 'react';

import SHOP_CART_ACTIONS from '../../constants/actions';

import './ShopCart.scss';

const ShopCart = ({ list, operateShopCart }) => {
    function handleClick({ target }) {
        operateShopCart(SHOP_CART_ACTIONS.REMOVE_PRODUCT, +target.closest('tr').id);
    }

    function handleChange({ target }) {
        operateShopCart(SHOP_CART_ACTIONS.CHANGE_PRODUCT_QUANTITY, +target.closest('tr').id, +target.value);
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
                                <input type="number" value={product.Pl} min={1} onChange={handleChange} />
                            </td>
                            <td className="table_row_cell table_row_cell--price">
                                {product.C}
                                {' '}
                                руб/шт
                            </td>
                            <td className="table_row_cell table_row_cell--remove">
                                <button type="button" onClick={handleClick}>Удалить</button>
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
