export default interface RevisionData {
    _id?: string;
    title?: string;
    entryDate?: Date | undefined;
    firstDate?: Date | undefined;
    secondDate?: Date | undefined;
    thirdDate?: Date | undefined;
    notification?: boolean;
}