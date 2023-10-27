import Http from "../utils/HttpCommon";
import Httpt from "../utils/HttpToken";

const getAll = (page:number, size:number) => {
    return Http.get(`/board?page=${page}&size=${size}`);
};

const write = (data:FormData) => {
    return Httpt.post("/board/user",data,{headers: {
        'Content-Type': 'multipart/form-data'}})
    };
const temp = () => {};


const BoardService = {
    getAll,
    write
}

export default BoardService;