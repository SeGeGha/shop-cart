import React, {
    useState, useEffect, useReducer, useMemo,
} from 'react';

import ProductTable from '../components/ProductTable/ProductTable';
import ShopCart from '../components/ShopCart/ShopCart';
import ErrorNotification from '../components/ErrorNotification/ErrorNotification';

import { getNewExchangeRate } from '../utils/numberRandomizer';
import convertCurrency from '../utils/currencyConverter';

import { APP_META_STATUSES, APP_REQUEST_INTERVAL } from '../constants/appConfig';
import PRODUCTS_LIST_ACTIONS from '../constants/actions';

import './App.scss';

function reducer(state, action) {
    switch (action.type) {
        case PRODUCTS_LIST_ACTIONS.ADD_TO_CART:
            return state.map((product) => (product.T === action.product.id ? { ...product, B: true, Pl: product.Pl || 1 } : product));
        case PRODUCTS_LIST_ACTIONS.REMOVE_FROM_CART:
            return state.map((product) => (product.T === action.product.id ? { ...product, B: false, Pl: null } : product));
        case PRODUCTS_LIST_ACTIONS.CHANGE_QUANTITY_IN_CART:
            return state.map((product) => {
                if (product.T === action.product.id && product.P >= action.product.quantity) {
                    return {
                        ...product,
                        Pl: action.product.quantity,
                    };
                }

                return product;
            });
        case PRODUCTS_LIST_ACTIONS.UPDATE:
            return action.state;
        default:
            return state;
    }
}

const App = () => {
    const [productGroupsStore, setProductGroupsStore] = useState({}); // data from names.json
    const [productsList, dispatchProductsList] = useReducer(reducer, []); // data.Value.Goods from data.json
    const [exchangeRate, setExchangeRate] = useState(1); // $/rub exchange rate, default = 1
    // combine products into groups
    const productTable = useMemo(() => {
        const groups = productsList.reduce((acc, product) => {
            const groupName = productGroupsStore[product.G].G;
            const productsListWithAddition = {
                ...product,
                N: productGroupsStore[product.G].B[product.T].N,
                C: convertCurrency(product.C, exchangeRate),
            };

            acc[groupName] = (Array.isArray(acc[groupName])) ? acc[groupName].concat(productsListWithAddition) : [productsListWithAddition];

            return acc;
        }, {});

        // Return arr [groupName, [product1, product2...]]
        return Object.entries(groups);
    }, [productsList, productGroupsStore, exchangeRate]);
    // filter products into cart
    const shopList = useMemo(() => productsList.filter((product) => product.B).map((product) => ({
        ...product,
        N: productGroupsStore[product.G].B[product.T].N,
        C: convertCurrency(product.C, exchangeRate),
    })), [productsList, productGroupsStore, exchangeRate]);

    const [status, setStatus] = useState(APP_META_STATUSES.GETTING); // Application management statuses

    const getActualData = () => {
        // console.log('reqStatus: ', reqStatus);
        fetch('/api')
            .then((res) => res.json())
            .then((data) => {
                setProductGroupsStore(data[1]); // Save data from names.json
                dispatchProductsList({ type: PRODUCTS_LIST_ACTIONS.UPDATE, state: data[0].Value.Goods });// Save data from data.json
                setExchangeRate(getNewExchangeRate()); // Update rate $ / rub
                setStatus(APP_META_STATUSES.LOADED); // Update app status - 'data loaded'
            })
            .catch(() => {
                setStatus((prevStatus) => (prevStatus === APP_META_STATUSES.GETTING ? APP_META_STATUSES.LOADING_ERROR : prevStatus));
            })
            .finally(() => {
                setTimeout(getActualData, APP_REQUEST_INTERVAL); // Send new request
            });
    };

    function postActualData(data) {
        fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    useEffect(() => getActualData(), []); // After app mounting we send data request

    // Save updated data
    useEffect(() => {
        if (productsList.length && status === APP_META_STATUSES.LOADED) {
            postActualData(productsList);
        }
    }, [productsList]);

    if (status === APP_META_STATUSES.GETTING) {
        return <h1>Loading</h1>;
    } if (status === APP_META_STATUSES.LOADED) {
        return (
            <>
                <section id="products">
                    <div className="exchange-rate-field-wrapper">
                        <label htmlFor="exchange-rate-field">
                            Текущий курс доллара к рублю:
                            <input
                                id="exchange-rate-field"
                                type="number"
                                value={exchangeRate}
                                min={1}
                                onChange={({ target }) => setExchangeRate(+target.value)}
                            />
                        </label>
                    </div>
                    {productTable.map(([groupName, products]) => (
                        <ProductTable
                            key={groupName}
                            name={groupName}
                            products={products}
                            addProductToCart={(product) => dispatchProductsList({
                                type: PRODUCTS_LIST_ACTIONS.ADD_TO_CART, product,
                            })}
                        />
                    ))}
                </section>
                <section id="shop-cart">
                    <ShopCart
                        list={shopList}
                        removeProductFromCart={(product) => dispatchProductsList({
                            type: PRODUCTS_LIST_ACTIONS.REMOVE_FROM_CART, product,
                        })}
                        changeProductQuantity={(product) => dispatchProductsList({
                            type: PRODUCTS_LIST_ACTIONS.CHANGE_QUANTITY_IN_CART, product,
                        })}
                    />
                </section>
            </>
        );
    }

    return <ErrorNotification />;
};

export default App;
