export class List{
    _id: string;
    author: string;
    title: string;
    message?: string | null;
    completed?: boolean | null;
    creationDate: Date;
    completedDate: Date;
}