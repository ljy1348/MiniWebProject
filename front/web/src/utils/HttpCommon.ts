import axios from "axios";

export default axios.create({
  // baseURL: "http://13.124.103.146:8080/api",
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});