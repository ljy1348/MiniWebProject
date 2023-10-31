import Http from "../utils/HttpCommon";

const add = (data:FormData) => {
    return Http.post("/user/img",data,{headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')}});
}

const FileService = {
    add
}

export default FileService;