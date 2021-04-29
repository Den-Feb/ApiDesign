export class ListItem{
    _id: string;
    author: string;
    title: string;
    message?: string | null;
    completed?: boolean | null;
    creationDate: Date;
    completedDate: Date;
}

export class ListResponse{
    items: ListItem[];
    result: boolean;
}