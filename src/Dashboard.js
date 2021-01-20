import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Directions, ExitToAppOutlined, Image } from '@material-ui/icons';
import {BrowserView, MobileView, isMobile} from 'react-device-detect';



import { Avatar, Badge, Grid, Tooltip, withStyles } from '@material-ui/core';
import GlobalState from './GlobalState';
import MyMenu from './Menu';
import {getMenuContent, getMenuIndex} from './MenuList';

import { useLocation, useHistory} from "react-router-dom";

import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 3,
    top: -1,
    backgroundColor: theme.palette.notification.main,
    color: "#fff",
    border: `1px solid ${theme.palette.notification.main}`,
    paddingRight: '4.5px',
    paddingTop: "1px"
  },
}))(Badge);

const StyledMenu = withStyles((theme) => ({
  paper: {
    marginTop: "2px",
    // marginRight: "5px",
    border: `1px solid #ddd`,
    borderRadius: "10px"
  },
}))((props) => (
  <Menu
    elevation={4}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    paddingTop:"10px",
    paddingBottom: "10px",
    fontSize: '0.9rem',
    '&:focus': {
      backgroundColor: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
 
  },
}))(MenuItem);


const drawerWidth = 150;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
   
    [theme.breakpoints.down('sm')]: {
      opacity: 0.92
    },
   
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },

  userAvatar:
  {
    backgroundColor: "#fff",
    borderColor: theme.palette.secondary.main,
    border: "1px solid",
    color: theme.palette.secondary.main,
    cursor: "pointer",
  },

  appBarText:{
    color: "#888",
    [theme.breakpoints.down('sm')]: {
      display: "none",
    },
  },

  appBarNotificationIcon:{
    color: "#888",
    cursor: "pointer"
  },

  appbarLogo:{
    position:"absolute",
    left:"50%",
    marginLeft: "-40px"
  },

  appbarLogoText:{
    position:"absolute",
    left:"50%",
    marginLeft: "-195px",
    paddingTop: "14px",
    display: "none",
    [theme.breakpoints.down('sm')]: {
      display: "none",
    },
  },

  logoBg:{
    // backgroundColor: "blue",
    width: "50px",
    height: "50px",
    border: `2px solid ${theme.palette.secondary.main}`,
    // backgroundColor : theme.palette.notification.light,
    borderRadius: "10px",
    padding: "1px"
    // paddingTop:"0px",
    // paddingLeft:"1px"
  }
  
}));

export default function Dashboard() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);
  const [open, setOpen] = React.useState(isMobile ? false : true);

  const [currentMenuIndex, setCurrentMenuIndex] = React.useState(0);

  const [anchorUserAvatar, setAnchorUserAvatar] = React.useState(null);
  const handleUserAvatarClick = (event) => {
    setAnchorUserAvatar(event.currentTarget);
  };
  const handleUserAvatarClose = () => {
    setAnchorUserAvatar(null);
  };

  const history = useHistory();

  let location = useLocation();
  React.useEffect(() => {

    const index = getMenuIndex(location.pathname.substr(1));
    setState(state => ({...state, currentMenuIndex: index}));

 
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0)

  }, []);

  useEffect( () => {
      setCurrentMenuIndex(state.currentMenuIndex);
      if (isMobile)
      {
        setOpen(false);
      }
  },[state.currentMenuIndex]);



  const handleDrawerOpen = () => {
    setOpen(!open);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  

  const handleLogout = () =>
  {
    localStorage.removeItem('app-auth-token');
    sessionStorage.removeItem('app-auth-token');
    setState(state => ({...state, signedIn: false}));
    history.replace('./login');
  }

  const handleProfileClicked = () =>
  {
    handleUserAvatarClose()
  }

  const handleMyAccountClicked = () =>
  {
    handleUserAvatarClose()
  }
  
  const handleLogoutClicked = () =>
  {
    handleLogout()
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        style={{ backgroundColor: "#fff", color: "#555" }}
        position="absolute"
        className={clsx(classes.appBar, false && open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>

          <div className={classes.appbarLogo}>
            <div className={classes.logoBg}>
                <img src="/images/logo_thin_only_black.png" alt="logo" width="45px" height="45px"/>
            </div>       
          </div>

          <div className={classes.appbarLogoText}>
            <div className={classes.logoTextBg}>
                <img src="/images/text_thin_only_black.png" alt="logo" width="150px" height="30px"/>
            </div>       
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              paddingLeft: "2%",
            }}
          >
            <Grid
              container
              spacing={2}
              direction="row-reverse"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <Avatar className={classes.userAvatar} onClick={handleUserAvatarClick}>
                  <PersonOutlineIcon />
                </Avatar>
              </Grid>

              <Grid item className={classes.appBarText}>
                <span>
                  {state.userId?.forename + " " + state.userId?.surname}
                </span>
              </Grid>

              <Grid item>
                <StyledBadge 
                  badgeContent={4} 
                  color="error"
                  style={{color: "#fff"}}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  >
                  <NotificationsNoneIcon className={classes.appBarNotificationIcon} />
                </StyledBadge>
              </Grid>
            </Grid>
          </div>

        </Toolbar>
      </AppBar>

      <StyledMenu
        id="user-avatar-menu"
        anchorEl={anchorUserAvatar}
        keepMounted
        open={Boolean(anchorUserAvatar)}
        onClose={handleUserAvatarClose}
      >
        <StyledMenuItem onClick={handleProfileClicked}>پروفایل من</StyledMenuItem>
        <StyledMenuItem onClick={handleMyAccountClicked}>تنظیمات اکانت</StyledMenuItem>
        <div style={{marginTop: "15px", paddingTop:"5px", borderTop:"1px solid #ddd"}}>
         <StyledMenuItem onClick={handleLogoutClicked}>خروج</StyledMenuItem>
        </div>     
      </StyledMenu>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />

        <MyMenu />
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container
          maxWidth={isMobile ? "xs" : "xl"}
          className={classes.container}
        >
          {getMenuContent(currentMenuIndex)}

          {/* <Box pt={4}>
            <Copyright />
          </Box> */}
        </Container>
      </main>
    </div>
  );
}