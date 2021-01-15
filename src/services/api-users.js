import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.users.inisashop.com/',

  headers : {
      'Authorization' : 'Basic QXp1cmXEaWFtb4ETOmh1bnRlc7UK'
  }
});