import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GlobalState from './GlobalState';

import { CardHeader, CircularProgress, Grid, IconButton, Tooltip } from '@material-ui/core';
import InstaFeedService from './services/InstaFeedService';


import LinearProgress from '@material-ui/core/LinearProgress';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import {BrowserView, MobileView, isMobile} from 'react-device-detect';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import AddProductDialog from './AddProductDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import clsx from "clsx";


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    title:{
        fontWeight: '400',
        fontFamily: 'BioRhyme, serif'
    },  

 
    appBar: {
      position: 'sticky',
      // backgroundColor: "#333",
      // color: "#fff",
      alignItems: 'center'
  
    },

    rootZoom: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
      },

   
      media: {
        height: 325,
      },

      card_root: {
        width: 265,
        border: "1px solid #eee",
        "&:hover":{
         boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
         border: `1px solid ${theme.palette.secondary.light}`,
        //  transform: "translate(-2px,-2px)"
        },
        transition: "all 0.1s ease-in-out"
      },

      card_root_product:{
        // border: `2px solid ${theme.palette.secondary.main}`,
        transition: "all 0.1s ease-in-out"
      },

      FabScrollTop:{
        position: 'absolute',
        bottom: theme.spacing(4),
        right: theme.spacing(isMobile ? 1 : 5),
      }
}));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 

export default function Posts() {
  const classes = useStyles();

  const topRef = React.useRef(null);

  const [state, setState] = React.useContext(GlobalState);

  const [feeds, setFeeds] = React.useState([]);
  const [endCursor, setEndCursor] = React.useState(null);

  const [loading, setLoading] = useState(false);

  const [loadMore, setLoadMore] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [showCaption, setShowCaption] = useState(false);

  const [openAddProductDialog, setOpenAddProductDialog] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState(null);

  const [openSuccessAlert, setOpenSuccessAlert] = React.useState(false);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessAlert(false);
  };
  
  useEffect( () => 
  {
     const loadFeeds = async () =>
     {
         try
         {
            setLoading(true);

            while (!state.shopId)
            {
                await sleep(200);
            }

            const res = await InstaFeedService.getFeeds(state.shopId, 36, endCursor);
            console.log(res);
            
            if (res.data.status === 'OK')
            {
               setFeeds(res.data.posts);
               setEndCursor(res.data.end_cursor);
            }    

            setLoading(false);

         }catch(err)
         {
             setLoading(false);
             console.error(err);
         }
          
     } 
    
     loadFeeds();

     const interval = setInterval(() => {
        setLoadMore(false);      
     }, 2000);

     return () => {
         clearInterval(interval);
     }
  
  }, []);

  useEffect( () => 
  {
     const loadFeeds = async () =>
     {
         try
         {        
            // console.log('loadFeeds...');
            setLoadingMore(true);
            const res = await InstaFeedService.getFeeds(state.shopId, 36, endCursor); 
            if (res.data.status === 'OK')
            {
               setFeeds([...feeds, ...res.data.posts]);
               setEndCursor(res.data.end_cursor);
            }    
            setLoadingMore(false);

         }catch(err)
         {
             setLoadingMore(false);
             console.error(err);
         }          
     } 

     if (endCursor && loadMore)
     {
        loadFeeds();
     }

  }, [loadMore]);


  const addProductClicked = (post) =>
  {
    setSelectedPost(post);
    setOpenAddProductDialog(true);
  }

  const addproductDialogClosed = () =>
  {
    setOpenAddProductDialog(false);
    setSelectedPost(null);
  }

  const scrollToTop = () => {    
    topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })  
  };

  const newProductSaved = (product) => {
    const post = feeds.find((post) => post.id === product.postId);
    post.productIds = [...post.productIds, product._id.toString()];

    setOpenAddProductDialog(false);
    setSelectedPost(null);
    setOpenSuccessAlert(true);
  };


  return (
    <React.Fragment>
      <div ref={topRef} id="back-to-top-anchor"></div>

      {loading && (
        <div style={{ width: "100%", paddingTop: "3px" }}>
          <LinearProgress color="secondary" />
        </div>
      )}

      {!loading && (
        <div style={{ padding: isMobile ? "30px" : "50px" }}>
          <Grid
            container
            direction="row-reverse"
            justify="center"
            alignItems="flex-start"
            spacing={4}
          
          >
            {feeds.map((post, index) => (
              <Grid
                key={`post-${index}`}
                item
                // xl={3}
                // lg={4}
                // md={6}
                // sm={12}
                // xs={12}
              >
                <Card
                   elevation={0}
                  className={clsx(classes.card_root, {
                    [classes.card_root_product]:
                      post.productIds && post.productIds.length > 0,
                  })}
                >
                  <CardHeader
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader={
                      <span style={{ fontSize: "0.8rem", color: "#888" }}>
                        {" "}
                        {new Date(post.postTimeStamp).toLocaleDateString(
                          "fa-IR",
                          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                        )}{" "}
                      </span>
                    }
                  />
                  <CardMedia
                    className={classes.media}
                    image={post.imageUrlSmall}
                    title="post image"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                    ></Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {showCaption
                        ? post.caption.length > 0
                          ? post.caption
                          : "برای این پست متنی وجود ندارد"
                        : ""}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button size="small" color="primary">
                      مشاهده جزئیات
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => addProductClicked(post)}
                    >
                      تعریف محصول
                    </Button>

                    <IconButton
                      style={{ flexGrow: 1, cursor: "pointer" }}
                      size="small"
                      color="primary"
                      onClick={() => setShowCaption(!showCaption)}
                    >
                      {/* <Tooltip title= {!showCaption? "مشاهده متن" : "پنهان کردن متن" }> */}
                      {!showCaption ? <ExpandMoreIcon /> : <ExpandLessIcon />}

                      {/* </Tooltip> */}
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {endCursor && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              <Button
                style={{ cursor: "pointer" }}
                color="primary"
                variant="outlined"
                onClick={() => setLoadMore(true)}
              >
                پست های بیشتر
              </Button>
            </div>
          )}
        </div>
      )}

      {loadingMore && (
        <div
          style={{
            position: "fixed",
            left: isMobile ? `10px` : `100px`,
            bottom: "50px",
          }}
        >
          <CircularProgress color="secondary" />
        </div>
      )}

      {!loading && (
        <Fab
          className={classes.FabScrollTop}
          color="secondary"
          size="small"
          aria-label="scroll back to top"
          onClick={() => scrollToTop()}
        >
          <KeyboardArrowUpIcon style={{ color: "#fff" }} />
        </Fab>
      )}

      <AddProductDialog
        open={openAddProductDialog}
        handleClose={addproductDialogClosed}
        productSaved={newProductSaved}
        post={selectedPost}
      />

      <Snackbar
        key="success-alert"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSuccessAlert}
        autoHideDuration={10000}
        onClose={handleAlertClose}
      >
        <Alert
          style={{ width: "90vw" }}
          onClose={handleAlertClose}
          severity="success"
        >
          محصول شما با موفقیت اضافه گردید
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}