type successCallback = (result: number) => void;
type failCallback = (errir: string) => void;

function add(num1: number,
    num2: number,
    success: successCallback,
    fail: failCallback){
        console.log("add-start");
        setTimeout(()=>{
            console.log("add-set Timout");
            if(!num1 && !num2){
                fail("num1 e num2 devono essere valorizzati");
                return;
            }

            // Per portare un risultato fuori dalla funzione time bisogna usare una callBack
            let result = num1 + num2;
            success(result);        //funzione callBack
        }, 2000);
    }

// Come chiamare la funzione con callback
add(2, 3, (data) =>{
        console.log("RISULTATO "+data);
    }, 
    (error) =>{
        console.log("ERRORE "+error);
    });

console.log("Codice dopo add()!");

var x = function(data: number){

}

x(100);

function add2(num1: number, num2: number){
    //tra <> vado a definire il tipo di ritorno;
    return new Promise<number>((resolve, reject) => {
        console.log("add-start");
        setTimeout(()=>{
            if(!num1 && !num2){
                reject("num1 e num2 devono essere valorizzati");  //in caso di errore: reject;
                return;
            }

            var result = num1 + num2;

            // quando non ci sono erorri: resolve;
            resolve(result);
        }, 2000);
    });    
}

// ESECUZIONE PROMISE
// .then per gestire i valori di ritorno (Dove vado ad usare le PROMISE);
add2(2, 3).then((data) =>{
    console.log("RISULTATO "+data);
}, (error: string) =>{
    console.log("ERRORE "+error);
});

class Product{
    id: number;
    name: number;
}

// QUELLO CHE ACCADE NELLE API:
// GET api/products        Product[]
// GET api/products/12     Product
// POST api/products       void
// PUT api/products/12     void
// DELETE api/products/12  void

// 401 Bad-request : Errori di validazione;
// RISULTATO CHE LE CHIAMATE API DOVREBBERO TORNARE
class ResponseWrapper<T>{
    // In base al risultato di result vado a distinguere per la promise se sarà da eseguire:
    // result: true;
    // reject: false.
    result: boolean;
    data: T;
    // Avvolte viene ritornato un array di oggetti
    errors: string[];
    status: number;
}

var respons = new ResponseWrapper<Product>();
respons.data = new Product();
respons.status = 200;