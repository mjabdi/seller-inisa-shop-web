import API from './api';

export default class PostImageService {

   static getPostImages = (postId) =>
   {

        return API.get(`/api/posts/getpostimages?post_id=${postId}`);
  
   }

};