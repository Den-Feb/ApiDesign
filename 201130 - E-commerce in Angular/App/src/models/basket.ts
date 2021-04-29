export class Basket{
    _id: string;
    idProduct: string;
    quantity: number;
}

export class BasketResponse{
    items: Basket[];
    result: boolean;
}