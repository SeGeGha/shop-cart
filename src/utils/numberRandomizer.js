import { APP_PRICE_RATE_RANGE } from '../constants/appConfig';

function getRandomRangeNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNewExchangeRate() {
    return getRandomRangeNumber(APP_PRICE_RATE_RANGE.MIN, APP_PRICE_RATE_RANGE.MAX);
}

export { getRandomRangeNumber, getNewExchangeRate };
