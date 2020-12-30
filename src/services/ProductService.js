import API from './api';

export default class ProductService {

   static addProduct = (product) =>
   {
        return API.post(`/api/products/addproduct`, product);
   }

};