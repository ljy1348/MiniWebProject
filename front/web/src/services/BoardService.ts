import IBoard from "../types/board/IBoard";
import Http from "../utils/HttpCommon";
import Httpt from "../utils/HttpToken";

const getAll = (page:number, size:number) => {
    return Http.get(`/board?page=${page}&size=${size}`);
};

const write = (data:FormData) => {
    return Http.post("/board/user",data,{headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')}})
    };
const get = (bid?:number|null) => {
    return Http.get("/board/"+bid);
};

const edit = (bid:number, data:IBoard) => {
    return Http.put("/board/user/"+bid,data,{headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')}});
}

const remove = (bid:number) => {
    return Http.delete("/board/user/"+bid,{headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')}});
};

const temp = () => {};


const BoardService = {
    getAll,
    write,
    get,
    edit,
    remove
}

export default BoardService;