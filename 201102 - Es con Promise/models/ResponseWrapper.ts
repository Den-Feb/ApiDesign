export class ResponseWrapper<T>{
    result: boolean;
    data: T;
    errors: string;
    status: number;
}