import StorefrontIcon from '@material-ui/icons/Storefront';
import InstagramIcon from '@material-ui/icons/Instagram';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

import DashboardPreview from './DashboardPreview';
import Posts from './Posts';




export const MenuList = [
    {index: 0, id:`dashboard`, title: `داشبورد`, icon : <StorefrontIcon style={{fontSize:"2.2rem"}}/>},
    {index: 1, id:`posts`, title: `پست ها`, icon : <InstagramIcon style={{fontSize:"2.2rem"}}/>},
    {index: 2, id:`products`, title: `محصولات`, icon : <LocalOfferIcon style={{fontSize:"2.2rem"}}/>},

  ];


  export const getMenuContent = (index) =>
  {
      switch(index)
      {
          case 0:
            return <DashboardPreview />
          case 1:
            return <Posts/>
          case 2:
            return 'products'
          default:
            return (`صفحه مورد نظر یافت نشد!`)
      }   
  }

  export const getMenuId = (index) =>
  {
      for (var i=0; i < MenuList.length; i++)
      {
          if (MenuList[i].index === index)
          {
              return MenuList[i].id;
          }
      }

      return (`Page Not Found!`); 
  }



  export const getMenuIndex = (id) =>
  {
      for (var i=0; i < MenuList.length; i++)
      {
          if (MenuList[i].id === id)
          {
              return MenuList[i].index;
          }
      }

      return -1;
  }




