import API from './api';

export default class ProductService {

   static addProduct = (product) =>
   {
        return API.post(`/api/products/addproduct`, product);
   }

   static getShopProducts = (shopId, pageSize, after) =>
   {
       if (!after)
       {
           return API.get(`/api/products/getshopproducts?shop_id=${shopId}&page_size=${pageSize}`);
       }
       else
       {
           return API.get(`/api/products/getshopproducts?shop_id=${shopId}&page_size=${pageSize}&after=${after}`);
       }     
   }

};