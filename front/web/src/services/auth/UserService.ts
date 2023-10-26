import IUser from "../../types/auth/IUser";
import Http from "../../utils/HttpCommon";
import Httpt from "../../utils/HttpToken";

const register = (data:IUser) => {
    return Http.post("/register", data);
}

const login = (data:IUser) => {
    return Http.post("/login", data);
}

const test = () =>{
    return Httpt.get("/user/test");
}

const isTokenExp = () => {
    if (localStorage.getItem('token') === null) {
        return false;
    }
    const token:any = localStorage.getItem("token");
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decod = JSON.parse(window.atob(base64));
    const exp = decod.exp;
    const now:number = Date.now() / 1000;
    if (now > Number(exp)) {
        return false;
    } else {
        return true;
    }
}

const getUserName = () => {
    if (localStorage.getItem('token') === null) {
        return "";
    }
    const token:any = localStorage.getItem("token");
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decod = JSON.parse(window.atob(base64));
    const userName = decod.sub;
    return userName;
}

const UserService = {
    register,
    login,
    test,
    isTokenExp,
    getUserName
}

export default UserService;

