import { API_END_POINTS } from "./endpoints";
import httpClient from "./httpClient";



class Client {
   paste ={  
    check: () => httpClient.get(API_END_POINTS.CHECK),
    post: (data:any) => httpClient.post(API_END_POINTS.CREATE_PASTE,data),
    getById: (id: string) => httpClient.get(API_END_POINTS.GET_PASTE.replace(":id",id)),
    }
}   

export default new Client()