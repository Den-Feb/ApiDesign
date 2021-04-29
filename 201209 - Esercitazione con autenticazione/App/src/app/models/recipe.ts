export class Recipe {
    _id: string;
    title: string;
    realizationTime: number;
    ingredients: string[];
    description: string;
    author: string;
}

export class ResponseWrapper<T> {
    public result: boolean;
    public status: number;
    public message: string;
    public data?: T | null;
    public datas?: T[] | null;
    public errors?: string | null;
}