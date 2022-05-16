import axios from "axios";

export default axios.create({
    baseURL: "https://localhost:44396/api/ProductSell",
    headers: {
        "Content-type": "application/json"
    }
});