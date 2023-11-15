import axios from "axios";

export default axios.create({
  // baseURL: "http://ip-172-31-46-247.ap-northeast-2.compute.internal:8080/api",
  baseURL: `http://${process.env.REACT_APP_BACK_HOST}/api`,
  headers: {
    "Content-Type": "application/json"
  }
});