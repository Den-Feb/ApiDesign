export class Product{
    _id: string;
    nome: string;
    descrizione: string;
    prezzo: number;
}

export class ProductResponse{
    items: Product[];
    result: boolean;
}