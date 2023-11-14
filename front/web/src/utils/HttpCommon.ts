import axios from "axios";

export default axios.create({
  baseURL: "http://ip-172-31-46-247.ap-northeast-2.compute.internal:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});