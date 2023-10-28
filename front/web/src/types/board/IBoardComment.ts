export default interface IBoardComment {
    bcid ?: any | null,
    commentWriter ?: string,
    commentContent : string,
    bid ?: any | null,
    isReComment : boolean,
    parentBcid ?: any | null,
    parentWriter ?: string | null,
    insertTime ?: string | null
}