function convertCurrency(value, rate) {
    return +(value * rate).toFixed(2);
}

export default convertCurrency;
