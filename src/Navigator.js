import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import { makeStyles } from '@material-ui/core/styles';

import GlobalState from './GlobalState';




import SignIn from './SignIn';
import Dashboard from './Dashboard';

import { useLocation, useHistory} from "react-router-dom";
import { getShopIdFromToken } from './TokenVerifier';


const useStyles = makeStyles((theme) => ({

    appBar: {
        position: 'static',
        backgroundColor: "#333",
        color: "#fff",
        //alignItems: 'center'
    
      },

      signOutButton:{
        color: "#fff",
        marginRight : "20px",
        fontWeight: "500"
      },

      title: {
        flexGrow : 1
      }


}));

export default function Navigator() {

    const classes = useStyles();
    const [state, setState] = React.useContext(GlobalState);

    let history = useHistory();

    const handleSignOut = () =>
    {
      setState(state => ({...state, signedIn: false}));

    }

    let location = useLocation();

    React.useEffect(() => {

      const checkToken = async () =>
      {
        const authToken = localStorage.getItem('inisa-auth-token') || sessionStorage.getItem('inisa-auth-token');
        setState(state => ({...state, authToken: authToken}));
        if (!authToken)
        {
          setState(state => ({...state, signedIn: false}));
          history.replace('/login');
        }
        else
        {
           const shopId = await getShopIdFromToken(authToken);
   
           if (location.pathname === '/' || location.pathname.startsWith('/login'))
           {
             setState(state => ({...state, signedIn: false}));
           }
           else
           {
             setState(state => ({...state, signedIn: true, shopId: shopId}));
           }
        }
      }

      checkToken();
   
    }, []);

    return (
        <React.Fragment>
            <CssBaseline />

                {!state.signedIn && (
                    <SignIn/> 
                )}

                { state.signedIn && (
                   <Dashboard/>
                )}      
        
        </React.Fragment>
    );
}