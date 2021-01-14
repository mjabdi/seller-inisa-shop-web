import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import { makeStyles } from '@material-ui/core/styles';

import GlobalState from './GlobalState';




import SignIn from './SignIn';
import SignUp from './SignUp';
import Dashboard from './Dashboard';

import { useLocation, useHistory} from "react-router-dom";
import { getUserIdFromToken } from './TokenVerifier';
import ForgotPassword from './ForgotPassword';

import UserService from './services/UserService';
import { getMenuId } from './MenuList';


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

    const [loaded, setLoaded] = React.useState(false)

    let history = useHistory();

    const handleSignOut = () =>
    {
      setState(state => ({...state, signedIn: false}));

    }

    let location = useLocation();

    React.useEffect(() => {

      const checkToken = async () =>
      {
        const authToken = localStorage.getItem('app-auth-token') || sessionStorage.getItem('app-auth-token');
     
        UserService.setToken(authToken)

        if (location.pathname.startsWith('/signup'))
        {
          setState(state => ({...state, signedIn: false, signedUp: true, forgotPassword: false}));
          setLoaded(true)

        }else if (location.pathname.startsWith('/forgotpassword'))
        {
          setState(state => ({...state, signedIn: false, signedUp: false, forgotPassword: true}));
          setLoaded(true)
        }
        else if (!authToken)
        {
          setState(state => ({...state, signedIn: false, signedUp: false, forgotPassword: false}));
          setLoaded(true)
          history.push('/login');
        }
        else
        {
           const userId = await getUserIdFromToken(authToken);
           if (!userId)
           {
              setState(state => ({...state, signedIn: false, signedUp: false, forgotPassword: false}));
              history.push('/login');
           }
           else if (location.pathname === '/' || location.pathname === '/#' || location.pathname.startsWith('/login'))
           {
             setState(state => ({...state, signedIn: true, signedUp: false, forgotPassword: false}));
             history.push(`/${getMenuId(0)}`);
           }
           else
           {
             setState(state => ({...state, signedIn: true, userId: userId}));
           }

           setLoaded(true)
        }
      }

      checkToken();
   
    }, [location.pathname]);

    const getComponentFromState = () =>
    {

      if (state.signedIn)
      {
        return <Dashboard/>
      }
      else
      {
        if (state.signedUp)
          return <SignUp/>
        else if (state.forgotPassword)
          return <ForgotPassword/>
        else
          return <SignIn/>    
      }
    }

    return (
        <React.Fragment>
            <CssBaseline />

            {
              loaded && (
                getComponentFromState()
              )
            }
        
        </React.Fragment>
    );
}