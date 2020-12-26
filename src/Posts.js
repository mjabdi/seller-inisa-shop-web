import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GlobalState from './GlobalState';

import { CircularProgress, Grid, IconButton, Tooltip } from '@material-ui/core';
import InstaFeedService from './services/InstaFeedService';


import LinearProgress from '@material-ui/core/LinearProgress';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import ScrollTrigger from 'react-scroll-trigger';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';

import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import {BrowserView, MobileView, isMobile} from 'react-device-detect';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';





function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });
  
    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
  
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  
    return (
      <Zoom in={trigger}>
        <div onClick={handleClick} role="presentation" className={classes.rootZoom}>
          {children}
        </div>
      </Zoom>
    );
  }
  
  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };



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
      },
}));

export default function Posts() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const [feeds, setFeeds] = React.useState([]);
  const [endCursor, setEndCursor] = React.useState(null);

  const [loading, setLoading] = useState(false);

  const [loadMore, setLoadMore] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [showCaption, setShowCaption] = useState(false);

  
  
  
  useEffect( () => 
  {
     const loadFeeds = async () =>
     {
         try
         {
            setLoading(true);
            const res = await InstaFeedService.getFeeds(state.shopId, 36, endCursor); 
            
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

    //  console.log(endCursor);

     if (endCursor && loadMore)
     {
        loadFeeds();
     }

  }, [loadMore]);



  const onProgressViewPort = ({progress}) =>
  {
      console.log(progress);
      console.log(loadMore);
     if (progress > 0.7)
     {
        setLoadMore(true);
     }
  }

  const handleScroll = e => {
    console.log(e);  
    let element = e.target
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // do something at end of scroll
    }
  }


  return (
    <React.Fragment>
      <div id="back-to-top-anchor"></div>

      {loading && (
        <div style={{ width: "100%", paddingTop: "3px" }}>
          <LinearProgress color="secondary" />
        </div>
      )}

      {!loading && (
        <div style={{ padding: "50px" }}>
          <Grid
            container
            direction="row-reverse"
            justify="center"
            alignItems="flex-start"
            spacing={1}
          >
            {feeds.map((post, index) => (
              <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
                <Card className={classes.card_root}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={post.imageUrlSmall}
                      title="Contemplative Reptile"
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
                         {showCaption ? (post.caption.length > 0 ? post.caption : 'برای این پست متنی وجود ندارد') : ''} 
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      مشاهده جزئیات
                    </Button>
                    <Button variant="outlined" size="small" color="primary">
                      تعریف محصول
                    </Button>

                    <IconButton
                      style={{ flexGrow: 1 }}
                      size="small"
                      color="primary"
                      onClick={() => setShowCaption(!showCaption)}
                      onTouchTap = {() => setShowCaption(!showCaption)}
                    >
                      <Tooltip title= {!showCaption? "مشاهده متن" : "پنهان کردن متن" }>
                        {!showCaption ? 
                            <ExpandMoreIcon/>
                        : 
                            <ExpandLessIcon/>
                        }
                       
                      </Tooltip>
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
                color="primary"
                variant="outlined"
                onClick={() => setLoadMore(true)}
                onTouchTap={() => setLoadMore(true)}
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

      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}