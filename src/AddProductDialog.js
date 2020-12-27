import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import PropTypes from "prop-types";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import { Grid, InputLabel, Paper, TextField } from "@material-ui/core";
import PostImageService from "./services/PostImageService";
import ImageGallery from 'react-image-gallery';
import "./image-gallery.css";
import RichTextEditor from 'react-rte';
import NumberFormat from 'react-number-format';

import {BrowserView, MobileView, isMobile} from 'react-device-detect';

const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Heading Large', style: 'header-one'},
      {label: 'Heading Medium', style: 'header-two'},
      {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ]
  };

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed",
  },

  appBarProduct: {
    position: "relative",
    backgroundColor: "#fff",
    width: "100%"
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
        minHeight: "200px",
        marginTop: theme.spacing(0),
        [theme.breakpoints.up('sm')]: {
          marginTop: theme.spacing(0),
        },
        
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0),
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(0),
         },
        },

    cardTitle:{
        fontSize : "1.2rem",
        fontWeight: "500",
        color : theme.palette.primary.main,
    },

    CaptionBox:{

        [theme.breakpoints.up('xs')]: {
            marginBottom: "20px"
        },

        [theme.breakpoints.up('md')]: {
            position: "fixed",
            width: "25%",
            right: "50px"
        },

        [theme.breakpoints.up('lg')]: {
            position: "fixed",
            width: "25%",
            right: "50px"
        },

        [theme.breakpoints.up('xl')]: {
            position: "fixed",
            width: "20%",
            right: "50px"
        },

    },

    ImageGallery:{

        [theme.breakpoints.up('md')]: {
            position: "fixed",
            width: "25%",
            left: "20px"
        },

        [theme.breakpoints.up('lg')]: {
            position: "fixed",
            width: "25%",
            left: "20px"
        },

        [theme.breakpoints.up('xl')]: {
            position: "fixed",
            width: "20%",
            left: "20px"
        },
    },



    ProductInfoCards:{
        // [theme.breakpoints.between('xs', 'sm')]: {
        //   marginTop: "200px"
        // },
    },

    RichTextEditor:{
        fontFamily: "IRANSans",
        minHeight: "200px",
        [theme.breakpoints.down('sm')]: {
            minHeight: "500px",
        },
    }

}));

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix=""
      />
    );
  }
  
  NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  


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

  const [productTitle, setProductTitle] = React.useState('');
  const productTitleChanged = (event) =>
  {
      setProductTitle(event.target.value);
  }

  const [productDescription, setProductDescription] = React.useState('');
  const [productDescriptionHTML, setProductDescriptionHTML] = React.useState(RichTextEditor.createEmptyValue());
  const productDescriptionChanged = (value) =>
  {
        setProductDescription(value.toString('html'));
        setProductDescriptionHTML(value);
  }

  const [productPrice, setProductPrice] = React.useState('');
  const productPriceChanged = (event) =>
  {
      setProductPrice(event.target.value);
  }

  const [productPriceAfterDiscount, setProductPriceAfterDiscount] = React.useState('');
  const productPriceAfterDiscountChanged = (event) =>
  { 
    setProductPriceAfterDiscount(event.target.value);
  }

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
          
        <React.Fragment>

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


          <div id="add-product-content" style={{ padding: "50px", marginTop:"20px" }}>
            
                    <div className={classes.ImageGallery} >
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

                    <div className={classes.CaptionBox}>
                        
                            <Paper elevation={8} className={classes.paper}>
                             {post.caption.length > 0 ? post.caption : 'متنی برای این پست وجود ندارد'}
                            </Paper>
                    </div>

             
            <Grid container direction="row" justify="center" alignItems="stretch" spacing={1}>
                <Grid className={classes.ProductInfoCards} item xs={12} sm={12} md={5} lg={5} xl={6}>
                      <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={3}
                        >
                            <Grid item>
                                <Paper elevation={8} className={classes.form}>
                                    <Paper elevation={0} className={classes.appBarProduct}>
                                            <Toolbar>           
                                                <Grid
                                                container
                                                direction="row"
                                                alignItems="flex-start"
                                                justify="flex-start"
                                                >
                                                <Grid item>
                                                    <span className={classes.cardTitle}>
                                                        عنوان
                                                    </span> 
                                                </Grid>
                                                </Grid>
                                            </Toolbar>
                                        </Paper>

                                        <div style={{padding:"20px", width: "100%"}}>
                                            <Grid container direction="column" justify="flex-start"  alignItems="stretch" spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField 
                                                            error={false}
                                                            required id="product-title" label="نام محصول" 
                                                            fullWidth autoComplete="none" 
                                                            value = {productTitle}
                                                            helperText="در این قسمت نام محصول یا کد محصول خود را وارد نمائید"
                                                            onChange = {productTitleChanged} 
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                   
                                                    <RichTextEditor
                                                        value={productDescriptionHTML}
                                                        onChange={productDescriptionChanged}
                                                        // toolbarConfig={toolbarConfig}
                                                        className={classes.RichTextEditor}
                                                        placeholder="توضیحات : در این قسمت مشخصات کالای خود را به طور کامل شرح دهید"
                                                        
                                                    />
                                                </Grid>

                                                {/* <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                                                    <TextField 
                                                            error={false}
                                                            required id="product-category" label="دسته بندی محصول" 
                                                            fullWidth autoComplete="none" 
                                                            value = {productTitle}
                                                            helperText="در این قسمت نام محصول یا کد محصول خود را وارد نمائید"
                                                            onChange = {productTitleChanged} 
                                                    />
                                                </Grid> */}



                                                {/* <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                                                    <TextField 
                                                            error={false}
                                                            required id="product-price" label="قیمت" 
                                                            fullWidth autoComplete="none" 
                                                            value = {productPrice}
                                                            helperText="لطفا قیمت پایه محصول خود را به تومان وارد نمائید"
                                                            onChange = {productPriceChanged} 
                                                    />
                                                </Grid> */}



                                                {/* <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                                                    <TextField 
                                                            error={false}
                                                            required id="product-description" label="توضیحات" 
                                                            fullWidth autoComplete="none" 
                                                            value = {productDescription}
                                                            multiline rowsMax={2} 
                                                            helperText="در این قسمت توضیحات مربوط به محصول خود را وارد نمائید"
                                                            onChange = {productDescriptionChanged} 
                                                    />
                                                </Grid> */}
                                            </Grid>
                                        </div>
                                    </Paper>
                            </Grid>


                            <Grid item>
                                 <Paper elevation={8} className={classes.form}>
                                    <Paper elevation={0} className={classes.appBarProduct}>
                                            <Toolbar>           
                                                <Grid
                                                container
                                                direction="row"
                                                alignItems="flex-start"
                                                justify="flex-start"
                                                >
                                                <Grid item>
                                                    <span className={classes.cardTitle}>
                                                        قیمت گذاری
                                                    </span> 
                                                </Grid>
                                                </Grid>
                                            </Toolbar>
                                        </Paper>

                                        <div style={{padding:"20px", width: "100%"}}>
                                            <Grid container direction="column" justify="flex-start"  alignItems="stretch" spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="قیمت ( بر حسب تومان )"
                                                        value={productPrice}
                                                        fullWidth
                                                        required
                                                        onChange={productPriceChanged}
                                                        helperText="برای وارد کردن قیمت لطفا کیبورد خود را به حالت اتگلیسی تغییر دهید"
                                                        name="product-price"
                                                        id="product-price-id"
                                                        InputProps={{
                                                        inputComponent: NumberFormatCustom,
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        label=" قیمت بعد از اعمال تخفیف   "
                                                        value={productPriceAfterDiscount}
                                                        fullWidth
                                                        onChange={productPriceAfterDiscountChanged}
                                                        helperText="این فیلد اختیاری می باشد و در صورت استفاده قیمت قبلی به صورت خط خورده برای مشتریان نمایش داده شده و قیمت جدید (بعد از تخفیف) به شکل حراج و تخفیف خورده برای مشتریان نمایش داده می شود که می تواند جذابیت بیشتری برای مشتریان ایجاد نماید"
                                                        name="product-price"
                                                        id="product-price-id"
                                                        InputProps={{
                                                        inputComponent: NumberFormatCustom,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </Paper>                
                            </Grid>

                            <Grid item>
                                 <Paper elevation={8} className={classes.form}>
                                    <Paper elevation={0} className={classes.appBarProduct}>
                                            <Toolbar>           
                                                <Grid
                                                container
                                                direction="row"
                                                alignItems="flex-start"
                                                justify="flex-start"
                                                >
                                                <Grid item>
                                                    <span className={classes.cardTitle}>
                                                        انبارگردانی
                                                    </span> 
                                                </Grid>
                                                </Grid>                                 
                                            </Toolbar>
                                        </Paper>

                                        <div style={{padding:"20px", width: "100%"}}>
                                            <Grid container direction="column" justify="flex-start"  alignItems="stretch" spacing={3}>
                                                <Grid item xs={12}>
                                                   
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </Paper>                
                            </Grid>

                            <Grid item>
                                 <Paper elevation={8} className={classes.form}>
                                    <Paper elevation={0} className={classes.appBarProduct}>
                                            <Toolbar>           
                                                <Grid
                                                container
                                                direction="row"
                                                alignItems="flex-start"
                                                justify="flex-start"
                                                >
                                                <Grid item>
                                                    <span className={classes.cardTitle}>
                                                        شیوه ارسال
                                                    </span> 
                                                </Grid>
                                                </Grid>
                                            </Toolbar>
                                        </Paper>

                                        <div style={{padding:"20px", width: "100%"}}>
                                            <Grid container direction="column" justify="flex-start"  alignItems="stretch" spacing={3}>
                                                <Grid item xs={12}>
                                                   
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </Paper>                
                            </Grid>

                            <Grid item>
                                 <Paper elevation={8} className={classes.form}>
                                    <Paper elevation={0} className={classes.appBarProduct}>
                                            <Toolbar>           
                                                <Grid
                                                container
                                                direction="row"
                                                alignItems="flex-start"
                                                justify="flex-start"
                                                >
                                                <Grid item>
                                                    <span className={classes.cardTitle}>
                                                        مدل های مختلف
                                                    </span> 
                                                </Grid>
                                                </Grid>
                                            </Toolbar>
                                        </Paper>

                                        <div style={{padding:"20px", width: "100%"}}>
                                            <Grid container direction="column" justify="flex-start"  alignItems="stretch" spacing={3}>
                                                <Grid item xs={12}>
                                                   
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </Paper>                
                            </Grid>

                            <Grid item>
                                 <Paper elevation={8} className={classes.form}>
                                    <Paper elevation={0} className={classes.appBarProduct}>
                                            <Toolbar>           
                                                <Grid
                                                container
                                                direction="row"
                                                alignItems="flex-start"
                                                justify="flex-start"
                                                >
                                                <Grid item>
                                                    <span className={classes.cardTitle}>
                                                        برچسب ها
                                                    </span> 
                                                </Grid>
                                                </Grid>                               
                                            </Toolbar>
                                        </Paper>

                                        <div style={{padding:"20px", width: "100%"}}>
                                            <Grid container direction="column" justify="flex-start"  alignItems="stretch" spacing={3}>
                                                <Grid item xs={12}>
                                                   
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </Paper>                
                            </Grid>



                    </Grid>
                </Grid>
            </Grid>
            

          </div>
        </Dialog>

        </React.Fragment>
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
