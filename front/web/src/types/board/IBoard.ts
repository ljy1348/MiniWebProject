export default interface IBoard {
    bid ?: any | null,
    title : string,
    writer : string,
    insertTime : string,
    views : number,
    content : string,
    isFile : boolean,
    vote : number
}