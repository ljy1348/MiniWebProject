export default interface IBoardList {
    bid ?: any | null,
    title : string,
    writer : string,
    insertTime : string,
    views : number,
    isPin : boolean,
    isFile : boolean,
    commentCount : number,
    vote : number,
    imgFid : number
}