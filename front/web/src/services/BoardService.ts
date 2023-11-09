import IBoard from "../types/board/IBoard";
import IBoardComment from "../types/board/IBoardComment";
import Http from "../utils/HttpCommon";
import Httpt from "../utils/HttpToken";

const getAll = (page:number, size:number) => {
    return Http.get(`/board?page=${page}&size=${size}`);
};

const getList = (searchTitle:string,searchContent:string ,page:number, size:number) => {
    return Http.get(`/board?searchTitle=${searchTitle}&searchContent=${searchContent}&page=${page}&size=${size}`);
};

const findBoardList = (title:string, writer:string, content:string, page:number, size:number) => {
    return Http.get(`/board?title=${title}&writer=${writer}&content=${content}&page=${page}&size=${size}`);
}

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

const boardCommendGet = (bid:number) => {
    return Http.get("/board/comment/"+bid);
};

const boardCommendFind = (commentWriter:string, commentContent:string) => {
    return Http.get(`/board/comment?commentWriter=${commentWriter}&commentContent=${commentContent}`);
};

const boardCommentAdd = (boardComment:IBoardComment, boardWriter:string) => {
    return Http.post("/board/user/comment?boardWriter="+boardWriter, boardComment, {headers: {
        'Authorization': localStorage.getItem('token')}});
};

const boardCommentEdit = (boardComment:IBoardComment) => {
    return Http.put("/board/user/comment/edit", boardComment, {headers: {
        'Authorization': localStorage.getItem('token')}});
};

const boardCommentDelete = (bcid:number) => {
    return Http.delete("/board/user/comment/delete/"+bcid, {headers: {
        'Authorization': localStorage.getItem('token')}});
};

const getBoardByUser = (writer:string) => {
    return Http.get(`/board/recent?writer=${writer}&page=0&size=5`);
};

const restoreBoard = (bid:number) => {
    return Http.put("/board/admin/recent/"+bid, "",{headers: {
        'Authorization': localStorage.getItem('token')}});
};

const temp = () => {};


const BoardService = {
    getAll,
    write,
    get,
    edit,
    remove,
    boardCommendGet,
    boardCommentAdd,
    boardCommentEdit,
    boardCommentDelete,
    getBoardByUser,
    restoreBoard,
    findBoardList,
    getList
}

export default BoardService;