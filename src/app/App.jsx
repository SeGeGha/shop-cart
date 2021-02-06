import React, { useState, useEffect } from 'react';

import ProductTable from '../components/ProductTable/ProductTable';
import ShopCart from '../components/ShopCart/ShopCart';
import ErrorNotification from '../components/ErrorNotification/ErrorNotification';

import { getNewExchangeRate } from '../utils/numberRandomizer';
import convertCurrency from '../utils/currencyConverter';

import { APP_META_STATUSES, APP_REQUEST_INTERVAL } from '../constants/appConfig';
import SHOP_CART_ACTIONS from '../constants/actions';

import './App.scss';

const App = () => {
    const [status, setStatus] = useState(APP_META_STATUSES.LOADING); // Application management statuses
    const [exchangeRate, setExchangeRate] = useState(1); // $/rub exchange rate, default = 1
    const [productGroupsStore, setProductGroupsStore] = useState({}); // data from names.json
    const [productsList, setProductsList] = useState([]); // data.Value.Goods from data.json

    const updateUsdRate = ({ target }) => { setExchangeRate(+target.value); };

    // TODO: FIX
    function operateShopCart(action, productId, value) {
        setProductsList((list) => {
            const newList = [...list];
            const idx = newList.findIndex((item) => item.T === productId);

            switch (action) {
                case SHOP_CART_ACTIONS.ADD_PRODUCT:
                    if (!newList[idx].B) { // If the product isn't added to shop cart
                        newList[idx].B = true; // .B = true -> product added to the cart
                        newList[idx].Pl = 1; // .Pl = 1 -> initially product quantity 1
                    }
                    break;
                case SHOP_CART_ACTIONS.REMOVE_PRODUCT:
                    newList[idx].B = false; // .B = false -> product NOT added to the cart
                    delete newList[idx].Pl; // .Pl = null -> reset quantity
                    break;
                case SHOP_CART_ACTIONS.CHANGE_PRODUCT_QUANTITY:
                    newList[idx].Pl = (newList[idx].P < value) ? newList[idx].P : value; // Quantity must be less than P
                    break;
                default:
                    break;
            }

            fetch('/api/shop-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newList),
            });

            return newList;
        });
    }

    function getActualData() {
        fetch('/api')
            .then((res) => res.json())
            .then((data) => {
                setStatus(APP_META_STATUSES.LOADED); // Update app status - 'data loaded'
                setProductGroupsStore(data[1]); // Save data from names.json - data[1]
                setProductsList(data[0].Value.Goods);// Save data from data.json - data[0]
                setExchangeRate(getNewExchangeRate()); // Update rate $ / rub

                // setTimeout(getActualData, APP_REQUEST_INTERVAL);
            })
            .catch(() => { setStatus(APP_META_STATUSES.ERROR); });
    }

    useEffect(getActualData, []); // After app mounting we send data request

    if (status === APP_META_STATUSES.LOADING) {
        return <h1>Loading</h1>;
    } if (status === APP_META_STATUSES.LOADED) {
        return (
            <>
                <section id="products">
                    <div className="exchange-rate-field-wrapper">
                        <label htmlFor="exchange-rate-field">
                            Текущий курс доллара к рублю:
                            <input type="number" value={exchangeRate} min={1} id="exchange-rate-field" onChange={updateUsdRate} />
                        </label>
                    </div>
                    {Object.entries(productsList.reduce((acc, product) => {
                        const productGroupName = productGroupsStore[product.G].G;
                        const obj = {
                            ...product,
                            N: productGroupsStore[product.G].B[product.T].N,
                            C: convertCurrency(product.C, exchangeRate),
                        };

                        acc[productGroupName] = (Array.isArray(acc[productGroupName]))
                            ? acc[productGroupName].concat(obj)
                            : [obj];

                        return acc;
                    }, {})).map(([groupName, products]) => (
                        <ProductTable
                            key={groupName}
                            name={groupName}
                            products={products}
                            addProductToCart={operateShopCart}
                        />
                    ))}
                </section>
                <section id="shop-cart">
                    <ShopCart
                        list={productsList.filter((product) => product.B).map((product) => ({
                            ...product,
                            N: productGroupsStore[product.G].B[product.T].N,
                            C: convertCurrency(product.C, exchangeRate),
                        }))}
                        operateShopCart={operateShopCart}
                    />
                </section>
            </>
        );
    }

    // TODO: FIX IF ITS UPDATE DATE FAIL
    return <ErrorNotification />;
};

export default App;
