import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import PropTypes, { func } from "prop-types";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import { Grid, Paper } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import PostImageService from "./services/PostImageService";
import ImageGallery from 'react-image-gallery';
import "./image-gallery.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paper: {
    marginTop: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(0),
    },
    
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
     },
    },

    form: {
        minHeight: "500px",
        marginTop: theme.spacing(0),
        [theme.breakpoints.up('sm')]: {
          marginTop: theme.spacing(0),
        },
        
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(4),
         },
        },


}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddProductDialog = ({
  open,
  handleClose,
  productSaved,
  productCanceled,
  post,
}) => {

  const classes = useStyles();

  const [postImages, setPostImages] = React.useState(null);

  React.useEffect( () => {

    const loadPostImages = async () =>
    {
        try
        {
            const res = await PostImageService.getPostImages(post.id);
            if (res.data.status === 'OK')
            {
                const temp = [];
                res.data.postImages.forEach(image => {
                    if (!image.isMainImage){
                        temp.push({imageUrl: image.imageUrl, imageUrlSmall: image.imageUrlSmall });
                    }
                });
                setPostImages([{imageUrl: post.imageUrl, imageUrlSmall: post.imageUrlSmall} ,...temp]);
            }
        }
        catch(err)
        {
            console.error(err);
        }

    }

    if (post)
    {
        setPostImages([{imageUrl: post.imageUrl, imageUrlSmall: post.imageUrlSmall}])
        loadPostImages();   
    }
 
  }, [post]);

  const _handleClose = () => {
        setPostImages(null);
        handleClose();
  };

  const cancelClicked = () => {
    if (productCanceled) productCanceled(post);

    _handleClose();
  };

  const saveClicked = () => {
    setTimeout(() => {
      if (productSaved) productSaved(post);

      _handleClose();
    }, 1000);
  };

  return (
    <>
      {post && (
        <Dialog
          fullScreen
          open={open}
          onClose={_handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={cancelClicked}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  {/* <Grid item>
                    <AddBoxIcon
                      style={{ fontSize: "1.8rem", marginLeft: "5px" }}
                    />
                  </Grid> */}
                  <Grid item>
                    <div style={{ paddingBottom: "0px" }}>تعریف محصول جدید</div>
                  </Grid>
                </Grid>
              </Typography>
              <Button variant="outlined" color="inherit" onClick={saveClicked}>
                ذخیره
              </Button>
            </Toolbar>
          </AppBar>


          <div id="add-product-content" style={{ padding: "50px" }}>
            
            <Grid container direction="row-reverse" spacing={2}>
                <Grid item xs={12} md={4} lg={3} xl={2}>
                    <div>
                        <ImageGallery 
                                items={getImages(postImages)}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                isRTL={true}
                                showNav={true}
                                lazyLoad={true}
                                showThumbnails={postImages?.length > 1}
                        />
                     </div>
                </Grid>
                <Grid item xs={12} md={3} lg={3} xl={2}>
                     <Paper elevation={8} className={classes.paper}>
                       {post.caption.length > 0 ? post.caption : 'متنی برای این پست وجود ندارد'}
                     </Paper>
                </Grid>

                <Grid item xs={12} md={5} lg={6} xl={8}>
                     <Paper elevation={8} className={classes.form}>

                     </Paper>
                </Grid>


            </Grid>
           

          </div>
        </Dialog>
      )}
    </>
  );
};

function getImages(postImages)
{
    const result = [];
    if (postImages)
    {
        postImages.forEach(post => {
            result.push({original: post.imageUrl, thumbnail: post.imageUrlSmall});
        });
    }
    return result;
}

AddProductDialog.propTypes = {
  open: PropTypes.any.isRequired,
  handleClose: PropTypes.func.isRequired,
  productSaved: PropTypes.func,
  productCanceled: PropTypes.func,
  post: PropTypes.object,
};

export default AddProductDialog;
