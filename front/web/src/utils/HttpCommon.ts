import axios from "axios";

export default axios.create({
  baseURL: "http://13.125.183.212:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});