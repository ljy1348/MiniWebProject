import Http from "../../utils/HttpCommon";

const getAll = (page:number, size:number) => {
    return Http.get(`/board/admin/deletion_board?page=${page}&size=${size}`, {headers: {
        'Authorization': localStorage.getItem('token')}});
};

const AdminService = {
    getAll
}

export default AdminService;