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
import { Checkbox, Chip, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Tooltip } from "@material-ui/core";
import PostImageService from "./services/PostImageService";
import ImageGallery from 'react-image-gallery';
import "./image-gallery.css";
import RichTextEditor from 'react-rte';
import NumberFormat from 'react-number-format';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import UndoIcon from '@material-ui/icons/Undo';
import {convertToPersian} from './persian-numbers';


import persianRex from 'persian-rex';

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
  
  function getTagsFromCaption(caption)
  {
    const result = caption.split(' ').filter(v=> v.startsWith('#'));
    return result;
  } 

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

  const [futureDayList, setFutureDayList] = React.useState([]);

  const [postImages, setPostImages] = React.useState(null);

  const [hashTags, setHashTags] = React.useState(null);

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

  const [productSKUCode, setProductSKUCode] = React.useState('');
  const productSKUCodeChanged = (event) =>
  {
      setProductSKUCode(event.target.value);
  }

  const [productBarCode, setProductBarCode] = React.useState('');
  const productBarCodeChanged = (event) =>
  {
      setProductBarCode(event.target.value);
  }

  const [trackQuantity, setTrackQuantity] = React.useState(false);
  const trackQuantityChanged = (event) =>
  {
        setTrackQuantity(event.target.checked);
  }

  const [continueSelling, setContinueSelling] = React.useState(false);
  const continueSellingChanged = (event) =>
  {
        setContinueSelling(event.target.checked);
  }

  const [inStock, setInStock] = React.useState(0);
  const inStockChanged = (event) =>
  {
        setInStock(event.target.value);
  }

  const [newHashTag, setNewHashTag] = React.useState('');
  const newHashTagChanged = (event) =>
  {
        setNewHashTag(event.target.value);
  }

  const [deliveryTimeOption, setDeliveryTimeOption] = React.useState('today');
  const deliveryTimeOptionChanged = (event) =>
  {
    setDeliveryTimeOption(event.target.value);
  }

  const [futureDay, setfutureDay] = React.useState(1);
  const futureDayChanged = (event) =>
  {
    setfutureDay(event.target.value);
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
        
        setHashTags(getTagsFromCaption(post.caption));
        populateFutureDayList();
    }
 
  }, [post]);

  const populateFutureDayList = () =>
  {
      const temp = [];
      for (var i=1 ; i <= 120; i++)
      {
        temp.push({value: i , text: i});
      }
      setFutureDayList(temp);
  }

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

  const deleteHashTagAtIndex = (index) =>
  {
      if (hashTags && hashTags[index])
      {
          let temp = [...hashTags];
          temp.splice(index,1);
          setHashTags(temp);
      }
  }

  const newHashTagPressed = (event) =>
  {
    if (event.key === 'Enter') {
        if (newHashTag && newHashTag.length > 0)
        {
            const newHashTagStr = '#' + newHashTag.trim();
            if (!hashTags.find(e => e.trim() === newHashTagStr))
            {
                hashTags.splice(0, 0, '#' + newHashTag);
            }
           
            setNewHashTag('');
        }
      }
  }

  const newHashTagClicked = () =>
  {
        if (newHashTag && newHashTag.length > 0)
        {
            const newHashTagStr = '#' + newHashTag.trim();
            if (!hashTags.find(e => e.trim() === newHashTagStr))
            {
                hashTags.splice(0, 0, '#' + newHashTag);
            }
           
            setNewHashTag('');
        }
  }

  const resetHashTagClicked = () =>
  {
    setHashTags(getTagsFromCaption(post.caption));
  }

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
                                                       انبارگردانی  ( اختیاری )
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
                                                                id="product-sku-code" label={" شناسه محصول" + " (SKU) "}
                                                                fullWidth autoComplete="none" 
                                                                value = {productSKUCode}
                                                                helperText="شناسه sku محصول در جاهای مختلفی مثل انبار، خرده فروشی، تجارت الکترونیک، تولید و بسته بندی، فروش و ردیابی محصول، تحلیل محصول و مدیریت محصول کاربرد دارد. معمولا از شناسه sku محصول برای شناسای محصول، اندازه یا نوع و سازنده آن استفاده می شود"
                                                                onChange = {productSKUCodeChanged} 
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                          <TextField 
                                                                error={false}
                                                                id="product-bar-code" label="بارکد محصول" 
                                                                fullWidth autoComplete="none" 
                                                                value = {productBarCode}
                                                                helperText="شناسه sku محصول در جاهای مختلفی مثل انبار، خرده فروشی، تجارت الکترونیک، تولید و بسته بندی، فروش و ردیابی محصول، تحلیل محصول و مدیریت محصول کاربرد دارد. معمولا از شناسه sku محصول برای شناسای محصول، اندازه یا نوع و سازنده آن استفاده می شود"
                                                                onChange = {productBarCodeChanged} 
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormControlLabel  
                                                            control={<Checkbox
                                                                    color="secondary" 
                                                                    name="trackQuantity" 
                                                                    checked={trackQuantity} 
                                                                    onChange={trackQuantityChanged} />}
                                                            label={<span style={{ fontSize: '0.8rem' }}>{`مدیریت موجودی محصولات`} 
                                                            </span>}
                                                        />
                                                    </Grid>

                                                    {trackQuantity && (
                                                        <React.Fragment>
                                                            <Grid item xs={12}>
                                                                <FormControlLabel 
                                                                    control={<Checkbox 
                                                                            color="secondary" 
                                                                            name="continueSelling" 
                                                                            checked={continueSelling} 
                                                                            onChange={continueSellingChanged} />}
                                                                    label={<span style={{ fontSize: '0.8rem' }}>{`حتی پس از اتمام موجودی، فروش ادامه یابد`} 
                                                                    </span>}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12}>

                                                                <TextField
                                                                    label="موجودی انبار"
                                                                    value={inStock}
                                                                    fullWidth
                                                                    onChange={inStockChanged}
                                                                    helperText="برای وارد کردن عدد لطفا کیبورد خود را به حالت اتگلیسی تغییر دهید"
                                                                    name="product-instock"
                                                                    id="product-instock-id"
                                                                    InputProps={{
                                                                    inputComponent: NumberFormatCustom,
                                                                    }}
                                                                />
                                                                
                                                            </Grid>
                                                        </React.Fragment>
                                                    )}                
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
                                                         زمان ارسال سفارش
                                                    </span> 
                                                </Grid>
                                                </Grid>
                                            </Toolbar>
                                        </Paper>

                                        <div style={{padding:"20px", width: "100%"}}>
                                            <InputLabel id="time-description" style={{textAlign:'justify', fontSize:"0.9rem", lineHeight:"1.7rem"}}>
                                                     توجه کنید زمان ارسال بدین معنی می باشد که محصول شما پس از دریافت سفارش از مشتری در چه مدت زمانی آماده ارسال می باشد، بدیهی است زمان دریافت محصول توسط مشتری به روش ارسال (پیک، پست ...) و همچنین زمانی که خود مشتری تعیین کرده است بستگی دارد
                                            </InputLabel>

                                            <InputLabel id="time-description" style={{textAlign:'justify', fontSize:"0.9rem", lineHeight:"1.7rem", marginTop:"10px" , marginBottom:"10px"}}>
                                                    شما می توانید روش های ارسال ، ساعات ارسال در طول شبانه روز و همچنین روزهای کاری خود را در قسمت تنظیمات فروشگاه ثبت نمائید
                                            </InputLabel>

                                            <Grid container direction="column" justify="flex-start"  alignItems="stretch" spacing={1}>
                                                <Grid item xs={12}>
                                                <FormControl component="fieldset">                                              
                                                    <RadioGroup aria-label="delivery-time" name="delivery-time" value={deliveryTimeOption} onChange={deliveryTimeOptionChanged}>
                                                        <FormControlLabel value="instant" control={<Radio />} label="ارسال فوری" />
                                                        <FormControlLabel value="today" control={<Radio />} label="ارسال در همان روز کاری" />
                                                        <FormControlLabel value="future" control={<Radio />} label="ارسال در روزهای کاری بعد " />
                                                    </RadioGroup>                                            
                                                </FormControl>
                                                </Grid>
                                                {deliveryTimeOption === 'future' && (
                                                    <Grid item xs={12}>
                                                    <div style={{display:"inline-block", paddingTop:"10px"}}>
                                                        ارسال در              
                                                    </div>
                                                  
                                                    <FormControl style={{paddingLeft:"10px", paddingRight:"10px"}} >
                                                            {/* <InputLabel id="future-days-label">روز</InputLabel> */}
                                                            <Select
                                                                labelId="future-days-label"
                                                                // variant= "outlined"
                                                                style={{textAlign:'center', minWidth:"50px", fontWeight:"800"}}
                                                                id="future-days-id"
                                                                value={futureDay}
                                                                onChange={futureDayChanged}
                                                             >
                                                                {
                                                                    futureDayList.map(item => (
                                                                            <MenuItem value={item.value}>{item.text}</MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                    </FormControl> 
                                                    روز کاری بعد                
                                                </Grid>

                                                )}
                                                
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
                                                <Grid item md={12} xl={9}>
                                                    
                                                    <Grid container direction="row" spacing={2} alignItems="flex-start">
                                                            <Grid item xs={8}>
                                                                <TextField 
                                                                    error={false}
                                                                    required id="product-hashtag" label="برچسب جدید" 
                                                                    autoComplete="none" 
                                                                    value = {newHashTag}
                                                                    helperText="برچسب ها به جستجوی هدفمند محصول شما در فروشگاه و در سطح اینترنت کمک می نماید. لطفا در انتخاب برچسب ها دقت نمائید و فقط از کلمات مرتبط با محصول خود استفاده نمائید."
                                                                    onChange = {newHashTagChanged} 
                                                                    onKeyDown= {newHashTagPressed}
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start">#</InputAdornment>,
                                                                    }}
                                                                />
                                                            </Grid>  

                                                            <Grid item xs={2} style={{paddingTop:"25px"}}>          
                                                                <Tooltip title="اضافه کردن برچسب جدید">                                           
                                                                    <IconButton 
                                                                                color="secondary" 
                                                                                aria-label="add new hashtag"
                                                                                onClick={newHashTagClicked}
                                                                                >
                                                                            <AddCircleOutlineIcon style={{fontSize:"2rem", color: "#1ab509"}}/>
                                                                    </IconButton>
                                                                </Tooltip>

                                                            </Grid>    

                                                            <Grid item xs={2} style={{paddingTop:"25px"}}>          
                                                                <Tooltip title="برگرداندن به حالت اولیه (برچسب های اولیه پست)">                                           
                                                                    <IconButton 
                                                                                color="default" 
                                                                                aria-label="reset hashtags"
                                                                                onClick={resetHashTagClicked}
                                                                                >
                                                                            <UndoIcon style={{fontSize:"2rem",color:"#e83a3a"}}/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>   
                                                    </Grid>
                                                    
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        { hashTags && hashTags.length > 0 && 
                                                            hashTags.map((tag,index) => (
                                                                <Grid item xs={12} sm>
                                                                     <Chip
                                                                        label={tag} 
                                                                        variant="outlined"
                                                                        onDelete={() => deleteHashTagAtIndex(index)}
                                                                        />
                                                                </Grid>
                                                         ))
                                                     }
                                                    </Grid>
                                                  
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
