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
        localStorage.removeItem('token');
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
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    const userName = decoded.sub;
    return userName;
    
}

const getUserRole = () => {
    if (localStorage.getItem('token') === null) {
        return "";
    }
    const token:any = localStorage.getItem("token");
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    const role = decoded.role;
    return role;
}



const UserService = {
    register,
    login,
    test,
    isTokenExp,
    getUserName,
    getUserRole
}

export default UserService;

