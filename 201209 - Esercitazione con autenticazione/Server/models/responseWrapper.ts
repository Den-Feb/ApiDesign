export class ResponseWrapper<T>{

    constructor (
        public result: boolean,
        public status: number,
        public message: string,
        public data?: T | null,
        public datas?: T[] | null,
        public errors?: string | null,
        ) {}
    
}