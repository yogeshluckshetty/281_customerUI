const CCRS_BASE_URL = "http://localhost:8080/ccrs"

const API_URL = {
    BASE: CCRS_BASE_URL,
    GET_LOCATIONS: CCRS_BASE_URL + "/customer/activelocations",
    POST_MAKE_COFFEE: CCRS_BASE_URL + "/coffee/order",
    GET_ORDER_STATUS: CCRS_BASE_URL + "/coffee/order/status?orderId="
}

export default API_URL;

