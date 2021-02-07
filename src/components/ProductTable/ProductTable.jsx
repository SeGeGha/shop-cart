import React from 'react';

import ProductItem from './ProductItem/ProductItem';

import './ProductTable.scss';

const ProductTable = ({ name, products, addProductToCart }) => {
    function handleClick({ target }) {
        addProductToCart({ id: +target.closest('.product-table_row').id });
    }

    return (
        <table className="product-table">
            <caption className="product-table_caption">{name}</caption>

            <tbody onClick={handleClick} onKeyPress={handleClick} role="presentation">
                {products.map((product) => (
                    <ProductItem key={product.T} id={product.T} info={product} />
                ))}
            </tbody>
        </table>
    );
};

export default ProductTable;
