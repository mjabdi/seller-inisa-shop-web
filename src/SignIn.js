import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import GlobalState from './GlobalState';
import Alert from '@material-ui/lab/Alert';
import { AppBar, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, OutlinedInput, Paper } from '@material-ui/core';
import { IconButton, Toolbar } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import clsx from 'clsx';

import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        InisaShop
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({

    root: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },

        display: 'flex',
        flexWrap: 'wrap',
      },  

      margin: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
      },

      paper: {
        marginTop: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
          marginTop: theme.spacing(8),
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(8),
        },
    
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },

    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

    submit: {
        margin: theme.spacing(3, 0, 2),
        fontSize: "1rem"
    },

    RememberMe:{
      textAlign: "left"
    },

    appBar: {
      position: 'static',
      // backgroundColor: "#333",
      // color: "#fff",
      alignItems: 'center'
  
    },
}));

export default function SignIn() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  let history = useHistory();

  const [password, setPassword] = React.useState('');

  const [username, setUsername] = React.useState('');
  

  const [saveChecked, setSaveChecked] = React.useState(false);
  


  const signIn = () => {
    if (username && password && ((username.toLowerCase() === 'admin' && password === 'inisa')))
    {
        const token = 'uoiuwier239489238';

        setState(state => ({...state, signedIn : true }));
        
        if (saveChecked)
        {
           localStorage.setItem('inisa-auth-token', token);
        }else{
           sessionStorage.setItem('inisa-auth-token', token);
        } 

        history.push('/dashboard');

    }else
    {
        setState(state => ({...state, signedInError : true }));
    }
  }

  const usernameChanged = (event) =>
  {
      setUsername(event.target.value);
      setState(state => ({...state, signedInError : false }));
  }

  const passwordChanged = (event) =>
  {
      setPassword(event.target.value);
      setState(state => ({...state, signedInError : false }));
  }

  const handleClickShowPassword = () => {
    setState(state => ({...state, showPassword : !state.showPassword }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const saveCheckedChanged = (event) =>
  {
    setSaveChecked(event.target.checked);
  }

  return (
    <React.Fragment>
        <AppBar position="absolute" color="primary" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h5" color="inherit" noWrap className={classes.title}>
                          <div style={{paddingTop:"20px", paddingBottom: "20px"}}>   پنل فروشندگان اینیساشاپ </div>
                           
                    </Typography>
                </Toolbar>
            </AppBar>
          <Container component="main" maxWidth="sm">

            <Paper elevation={8} className={classes.paper}>
           
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
              </Avatar>
              <Typography component="h1" variant="h6" style={{marginBottom:"20px"}}>
                      ورود به پنل فروشندگان
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  value={username}
                  onChange={usernameChanged}
                  margin="normal"
                  required
                  fullWidth
                  id="usrname"
                  label="نام کاربری (ایمیل)"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />

              <FormControl 
                              fullWidth 
                              required 
                              className={clsx(classes.margin, classes.textField)} 
                              variant="outlined"
                              onKeyPress= {event => {
                                if (event.key === 'Enter') {
                                  signIn();
                                }
                              }}
                              
                              >
                  <InputLabel htmlFor="outlined-adornment-password">رمز عبور</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    name="outlined-adornment-password"
                    type={state.showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={passwordChanged}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {state.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={100}
                  />
                </FormControl>
              
              <div align="right">
                  <FormControlLabel className={classes.RememberMe}
                      control={<Checkbox value="remember" color="primary" checked={saveChecked} onChange={saveCheckedChanged}  />}
                      label="مرا به خاطر بسپار"
                    />
              </div>

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick = {signIn}
                  onTouchTap = {signIn}
                  className={classes.submit}
                >
                  ورود
                </Button>


              </form>

              </Paper>
           

            {state.signedInError && (
                <div className={classes.root}>
                    <Alert fullWidth severity="error">نام کاربری یا رمز عبور اشتباه می باشد</Alert>
                </div> 
            )}

            <Box mt={8}>
              <Copyright />
            </Box>
          </Container>

    </React.Fragment>

    
  );
}