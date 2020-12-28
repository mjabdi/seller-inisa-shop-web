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
import {
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import PostImageService from "./services/PostImageService";
import ImageGallery from "react-image-gallery";
import "./image-gallery.css";
import RichTextEditor from "react-rte";
import NumberFormat from "react-number-format";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";

import { convertToPersian } from "./persian-numbers";

import persianRex from "persian-rex";

import { BrowserView, MobileView, isMobile } from "react-device-detect";

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: [
    "INLINE_STYLE_BUTTONS",
    "BLOCK_TYPE_BUTTONS",
    "LINK_BUTTONS",
    "BLOCK_TYPE_DROPDOWN",
    "HISTORY_BUTTONS",
  ],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD", className: "custom-css-class" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: "Normal", style: "unstyled" },
    { label: "Heading Large", style: "header-one" },
    { label: "Heading Medium", style: "header-two" },
    { label: "Heading Small", style: "header-three" },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
  ],
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed",
  },

  appBarProduct: {
    position: "relative",
    backgroundColor: "#fff",
    width: "100%",
  },

  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paper: {
    marginTop: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(0),
    },

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(4),
    },
  },

  form: {
    minHeight: "200px",
    marginTop: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(0),
    },

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    padding: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(0),
    },
  },

  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: theme.palette.primary.main,
  },

  CaptionBox: {
    [theme.breakpoints.up("xs")]: {
      marginBottom: "20px",
    },

    [theme.breakpoints.up("md")]: {
      position: "fixed",
      width: "25%",
      right: "50px",
    },

    [theme.breakpoints.up("lg")]: {
      position: "fixed",
      width: "25%",
      right: "50px",
    },

    [theme.breakpoints.up("xl")]: {
      position: "fixed",
      width: "20%",
      right: "50px",
    },
  },

  ImageGallery: {
    [theme.breakpoints.up("md")]: {
      position: "fixed",
      width: "25%",
      left: "20px",
    },

    [theme.breakpoints.up("lg")]: {
      position: "fixed",
      width: "25%",
      left: "20px",
    },

    [theme.breakpoints.up("xl")]: {
      position: "fixed",
      width: "20%",
      left: "20px",
    },
  },

  ProductInfoCards: {
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   marginTop: "200px"
    // },
  },

  RichTextEditor: {
    fontFamily: "IRANSans",
    minHeight: "200px",
    [theme.breakpoints.down("sm")]: {
      minHeight: "500px",
    },
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
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

function getTagsFromCaption(caption) {
  const result = caption.split(" ").filter((v) => v.startsWith("#"));
  return result;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
     display: "inline-block", 
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

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
  const [productColors, setProductColors] = React.useState([]);
  const [productSizes, setProductSizes] = React.useState([]);
  const [productMaterials, setProductMaterials] = React.useState([]);
  const [productModels, setProductModels] = React.useState([]);

  const [productTitle, setProductTitle] = React.useState("");
  const productTitleChanged = (event) => {
    setProductTitle(event.target.value);
  };

  const [productDescription, setProductDescription] = React.useState("");
  const [productDescriptionHTML, setProductDescriptionHTML] = React.useState(
    RichTextEditor.createEmptyValue()
  );
  const productDescriptionChanged = (value) => {
    setProductDescription(value.toString("html"));
    setProductDescriptionHTML(value);
  };

  const [productPrice, setProductPrice] = React.useState("");
  const productPriceChanged = (event) => {
    setProductPrice(event.target.value);
  };

  const [
    productPriceAfterDiscount,
    setProductPriceAfterDiscount,
  ] = React.useState("");
  const productPriceAfterDiscountChanged = (event) => {
    setProductPriceAfterDiscount(event.target.value);
  };

  const [productSKUCode, setProductSKUCode] = React.useState("");
  const productSKUCodeChanged = (event) => {
    setProductSKUCode(event.target.value);
  };

  const [productBarCode, setProductBarCode] = React.useState("");
  const productBarCodeChanged = (event) => {
    setProductBarCode(event.target.value);
  };

  const [trackQuantity, setTrackQuantity] = React.useState(false);
  const trackQuantityChanged = (event) => {
    setTrackQuantity(event.target.checked);
  };

  const [continueSelling, setContinueSelling] = React.useState(false);
  const continueSellingChanged = (event) => {
    setContinueSelling(event.target.checked);
  };

  const [inStock, setInStock] = React.useState(0);
  const inStockChanged = (event) => {
    setInStock(event.target.value);
  };

  const [newHashTag, setNewHashTag] = React.useState("");
  const newHashTagChanged = (event) => {
    setNewHashTag(event.target.value);
  };

  const [deliveryTimeOption, setDeliveryTimeOption] = React.useState("today");
  const deliveryTimeOptionChanged = (event) => {
    setDeliveryTimeOption(event.target.value);
  };

  const [futureDay, setfutureDay] = React.useState(1);
  const futureDayChanged = (event) => {
    setfutureDay(event.target.value);
  };

  const [hasVariants, setHasVariants] = React.useState(false);
  const hasVariantsChanged = (event) => {
    setHasVariants(event.target.checked);
  };

  const [newColor, setNewColor] = React.useState("");
  const newColorChanged = (event) => {
    setNewColor(event.target.value);
  };

  const [newSize, setNewSize] = React.useState("");
  const newSizeChanged = (event) => {
    setNewSize(event.target.value);
  };

  const [newMaterial, setNewMaterial] = React.useState("");
  const newMaterialChanged = (event) => {
    setNewMaterial(event.target.value);
  };

  const [newModel, setNewModel] = React.useState("");
  const newModelChanged = (event) => {
    setNewModel(event.target.value);
  };

  React.useEffect(() => {
    const loadPostImages = async () => {
      try {
        const res = await PostImageService.getPostImages(post.id);
        if (res.data.status === "OK") {
          const temp = [];
          res.data.postImages.forEach((image) => {
            if (!image.isMainImage) {
              temp.push({
                imageUrl: image.imageUrl,
                imageUrlSmall: image.imageUrlSmall,
              });
            }
          });
          setPostImages([
            { imageUrl: post.imageUrl, imageUrlSmall: post.imageUrlSmall },
            ...temp,
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (post) {
      setPostImages([
        { imageUrl: post.imageUrl, imageUrlSmall: post.imageUrlSmall },
      ]);
      loadPostImages();

      setHashTags(getTagsFromCaption(post.caption));
      populateFutureDayList();
    }
  }, [post]);

  const populateFutureDayList = () => {
    const temp = [];
    for (var i = 1; i <= 120; i++) {
      temp.push({ value: i, text: i });
    }
    setFutureDayList(temp);
  };

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

  const deleteHashTagAtIndex = (index) => {
    if (hashTags && hashTags[index]) {
      let temp = [...hashTags];
      temp.splice(index, 1);
      setHashTags(temp);
    }
  };

  const newHashTagPressed = (event) => {
    if (event.key === "Enter") {
      if (newHashTag && newHashTag.trim().length > 0) {
        const newHashTagStr = "#" + newHashTag.trim();
        if (!hashTags.find((e) => e.trim() === newHashTagStr)) {
          hashTags.splice(0, 0, newHashTagStr);
        }

        setNewHashTag("");
      }
    }
  };

  const newHashTagClicked = () => {
    if (newHashTag && newHashTag.trim().length > 0) {
      const newHashTagStr = "#" + newHashTag.trim();
      if (!hashTags.find((e) => e.trim() === newHashTagStr)) {
        hashTags.splice(0, 0, newHashTagStr);
      }

      setNewHashTag("");
    }
  };

  const newColorPressed = (event) => {
    if (event.key === "Enter") {
      if (newColor && newColor.trim().length > 0) {
        if (!productColors.find((e) => e.trim() === newColor.trim())) {
          productColors.splice(0, 0, newColor.trim());
        }

        setNewColor("");
      }
    }
  };

  const newColorClicked = () => {
    if (newColor && newColor.trim().length > 0) {
      if (!productColors.find((e) => e.trim() === newColor.trim())) {
        productColors.splice(0, 0, newColor.trim());
      }

      setNewColor("");
    }
  };

  const deleteColorAtIndex = (index) => {
    if (productColors && productColors[index]) {
      let temp = [...productColors];
      temp.splice(index, 1);
      setProductColors(temp);
    }
  };

  const newSizePressed = (event) => {
    if (event.key === "Enter") {
      if (newSize && newSize.trim().length > 0) {
        if (!productSizes.find((e) => e.trim() === newSize.trim())) {
          productSizes.splice(0, 0, newSize.trim());
        }

        setNewSize("");
      }
    }
  };

  const newSizeClicked = () => {
    if (newSize && newSize.trim().length > 0) {
      if (!productSizes.find((e) => e.trim() === newSize.trim())) {
        productSizes.splice(0, 0, newSize.trim());
      }

      setNewSize("");
    }
  };

  const deleteSizeAtIndex = (index) => {
    if (productSizes && productSizes[index]) {
      let temp = [...productSizes];
      temp.splice(index, 1);
      setProductSizes(temp);
    }
  };

  const newMaterialPressed = (event) => {
    if (event.key === "Enter") {
      if (newMaterial && newMaterial.trim().length > 0) {
        if (!productMaterials.find((e) => e.trim() === newMaterial.trim())) {
          productMaterials.splice(0, 0, newMaterial.trim());
        }

        setNewMaterial("");
      }
    }
  };

  const newMaterialClicked = () => {
    if (newMaterial && newMaterial.trim().length > 0) {
      if (!productMaterials.find((e) => e.trim() === newMaterial.trim())) {
        productMaterials.splice(0, 0, newMaterial.trim());
      }

      setNewMaterial("");
    }
  };

  const deleteMaterialAtIndex = (index) => {
    if (productMaterials && productMaterials[index]) {
      let temp = [...productMaterials];
      temp.splice(index, 1);
      setProductMaterials(temp);
    }
  };

  const newModelPressed = (event) => {
    if (event.key === "Enter") {
      if (newModel && newModel.trim().length > 0) {
        if (!productModels.find((e) => e.trim() === newModel.trim())) {
          productModels.splice(0, 0, newModel.trim());
        }

        setNewModel("");
      }
    }
  };

  const newModelClicked = () => {
    if (newModel && newModel.trim().length > 0) {
        if (!productModels.find((e) => e.trim() === newModel.trim())) {
          productModels.splice(0, 0, newModel.trim());
        }

        setNewModel("");
      }
  };

  const deleteModelAtIndex = (index) => {
    if (productModels && productModels[index]) {
      let temp = [...productModels];
      temp.splice(index, 1);
      setProductModels(temp);
    }
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
                      <div style={{ paddingBottom: "0px" }}>
                        تعریف محصول جدید
                      </div>
                    </Grid>
                  </Grid>
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={saveClicked}
                >
                  ذخیره
                </Button>
              </Toolbar>
            </AppBar>

            <div
              id="add-product-content"
              style={{ padding: "50px", marginTop: "20px" }}
            >
              <div className={classes.ImageGallery}>
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
                  {post.caption.length > 0
                    ? post.caption
                    : "متنی برای این پست وجود ندارد"}
                </Paper>
              </div>

              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                spacing={1}
              >
                <Grid
                  className={classes.ProductInfoCards}
                  item
                  xs={12}
                  sm={12}
                  md={5}
                  lg={5}
                  xl={6}
                >
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
                                <span className={classes.cardTitle}>عنوان</span>
                              </Grid>
                            </Grid>
                          </Toolbar>
                        </Paper>

                        <div style={{ padding: "20px", width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                            spacing={3}
                          >
                            <Grid item xs={12}>
                              <TextField
                                error={false}
                                required
                                id="product-title"
                                label="نام محصول"
                                fullWidth
                                autoComplete="none"
                                value={productTitle}
                                helperText="در این قسمت نام محصول یا کد محصول خود را وارد نمائید"
                                onChange={productTitleChanged}
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

                        <div style={{ padding: "20px", width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                            spacing={3}
                          >
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
                                  انبارگردانی ( اختیاری )
                                </span>
                              </Grid>
                            </Grid>
                          </Toolbar>
                        </Paper>

                        <div style={{ padding: "20px", width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                            spacing={3}
                          >
                            <Grid item xs={12}>
                              <TextField
                                error={false}
                                id="product-sku-code"
                                label={" شناسه محصول" + " (SKU) "}
                                fullWidth
                                autoComplete="none"
                                value={productSKUCode}
                                helperText="شناسه sku محصول در جاهای مختلفی مثل انبار، خرده فروشی، تجارت الکترونیک، تولید و بسته بندی، فروش و ردیابی محصول، تحلیل محصول و مدیریت محصول کاربرد دارد. معمولا از شناسه sku محصول برای شناسای محصول، اندازه یا نوع و سازنده آن استفاده می شود"
                                onChange={productSKUCodeChanged}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                error={false}
                                id="product-bar-code"
                                label="بارکد محصول"
                                fullWidth
                                autoComplete="none"
                                value={productBarCode}
                                helperText="شناسه sku محصول در جاهای مختلفی مثل انبار، خرده فروشی، تجارت الکترونیک، تولید و بسته بندی، فروش و ردیابی محصول، تحلیل محصول و مدیریت محصول کاربرد دارد. معمولا از شناسه sku محصول برای شناسای محصول، اندازه یا نوع و سازنده آن استفاده می شود"
                                onChange={productBarCodeChanged}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    name="trackQuantity"
                                    checked={trackQuantity}
                                    onChange={trackQuantityChanged}
                                  />
                                }
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    {`مدیریت موجودی محصولات`}
                                  </span>
                                }
                              />
                            </Grid>

                            {trackQuantity && (
                              <React.Fragment>
                                <Grid item xs={12}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        color="secondary"
                                        name="continueSelling"
                                        checked={continueSelling}
                                        onChange={continueSellingChanged}
                                      />
                                    }
                                    label={
                                      <span style={{ fontSize: "0.8rem" }}>
                                        {`حتی پس از اتمام موجودی، فروش ادامه یابد`}
                                      </span>
                                    }
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

                        <div style={{ padding: "20px", width: "100%" }}>
                          <div
                            id="time-description"
                            style={{
                              textAlign: "justify",
                              fontSize: "0.9rem",
                              lineHeight: "1.7rem",
                              color: "#777",
                            }}
                          >
                            توجه کنید زمان ارسال بدین معنی می باشد که محصول شما
                            پس از دریافت سفارش از مشتری در چه مدت زمانی آماده
                            ارسال می باشد، بدیهی است زمان دریافت محصول توسط
                            مشتری به روش ارسال (پیک، پست ...) و همچنین زمانی که
                            خود مشتری تعیین کرده است بستگی دارد
                          </div>

                          <div
                            id="time-description"
                            style={{
                              textAlign: "justify",
                              fontSize: "0.9rem",
                              lineHeight: "1.7rem",
                              marginTop: "10px",
                              marginBottom: "10px",
                              color: "#777",
                            }}
                          >
                            شما می توانید روش های ارسال ، ساعات ارسال در طول
                            شبانه روز و همچنین روزهای کاری خود را در قسمت
                            تنظیمات فروشگاه ثبت نمائید
                          </div>

                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                            spacing={1}
                          >
                            <Grid item xs={12}>
                              <FormControl component="fieldset">
                                <RadioGroup
                                  aria-label="delivery-time"
                                  name="delivery-time"
                                  value={deliveryTimeOption}
                                  onChange={deliveryTimeOptionChanged}
                                >
                                  <FormControlLabel
                                    value="instant"
                                    control={<Radio />}
                                    label="ارسال فوری"
                                  />
                                  <FormControlLabel
                                    value="today"
                                    control={<Radio />}
                                    label="ارسال در همان روز کاری"
                                  />
                                  <FormControlLabel
                                    value="future"
                                    control={<Radio />}
                                    label="ارسال در روزهای کاری بعد "
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            {deliveryTimeOption === "future" && (
                              <Grid item xs={12}>
                                <div
                                  style={{
                                    display: "inline-block",
                                    paddingTop: "10px",
                                  }}
                                >
                                  ارسال در
                                </div>
                                <FormControl
                                  style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                  }}
                                >
                                  {/* <InputLabel id="future-days-label">روز</InputLabel> */}
                                  <Select
                                    labelId="future-days-label"
                                    // variant= "outlined"
                                    style={{
                                      textAlign: "center",
                                      minWidth: "50px",
                                      fontWeight: "800",
                                      color: "#922c88"
                                    }}
                                    id="future-days-id"
                                    value={futureDay}
                                    onChange={futureDayChanged}
                                  >
                                    {futureDayList.map((item) => (
                                      <MenuItem value={item.value}>
                                        {item.text}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                روز کاری بعد
                              </Grid>
                            )}

                            <Grid item xs={12}></Grid>
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

                        <div style={{ width: "95%", marginBottom: "20px" }}>
                          <div
                            id="time-description"
                            style={{
                              textAlign: "justify",
                              fontSize: "0.9rem",
                              lineHeight: "1.7rem",
                              marginTop: "10px",
                              marginBottom: "20px",
                              color: "#777",
                            }}
                          >
                            اگر محصول شما در سایزها، رنگ ها و یا جنس های مختلف
                            ارائه می گردد، در این قسمت می توانید آنها را تعریف
                            نمائید
                          </div>

                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="color-content"
                              id="color-header"
                            >
                              <Typography className={classes.heading}>
                                رنگ
                              </Typography>
                            
                            {
                                productColors.map( (tag,index) => (
                                    <span style={{marginRight:"10px", color: "#922c88"}}>
                                        {index === 0 ? '( ' : ''}
                                         {tag}
                                         {index === (productColors.length - 1) ? ' )' : ' , '} 
                                    </span>
                                ))
                            }

                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                                spacing={3}
                              >
                                <Grid item xs={12}>
                                  <div
                                    style={{ padding: "20px", width: "100%" }}
                                  >
                                    <Grid
                                      container
                                      direction="column"
                                      justify="flex-start"
                                      alignItems="stretch"
                                      spacing={3}
                                    >
                                      <Grid item md={12} xl={9}>
                                        <Grid
                                          container
                                          direction="row"
                                          spacing={1}
                                          alignItems="flex-start"
                                        >
                                          <Grid item xs={8}>
                                            <TextField
                                              error={false}
                                              variant="outlined"
                                              fullWidth
                                              id="product-color"
                                              label="رنگ"
                                              placeholder={
                                                isMobile
                                                  ? ""
                                                  : "رنگ مورد نظر خود را بنویسید و enter بزنید"
                                              }
                                              autoComplete="none"
                                              value={newColor}
                                              onChange={newColorChanged}
                                              onKeyDown={newColorPressed}
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            xs={1}
                                            style={{ paddingTop: "0px" }}
                                          >
                                            <Tooltip title="اضافه کردن رنگ جدید">
                                              <IconButton
                                                color="secondary"
                                                aria-label="add new color"
                                                onClick={newColorClicked}
                                              >
                                                <AddBoxIcon
                                                  style={{ fontSize: "2.5rem" }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                          {productColors &&
                                            productColors.length > 0 &&
                                            productColors.map((tag, index) => (
                                              <Grid
                                                item
                                                xs={6}
                                                sm={6}
                                                md={4}
                                                lg={2}
                                                direction="row"
                                                justify="flex-end"
                                                alignItems="flex-start"
                                              >
                                                <Chip
                                                  label={tag}
                                                  variant="outlined"
                                                  onDelete={() =>
                                                    deleteColorAtIndex(index)
                                                  }
                                                />
                                              </Grid>
                                            ))}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </div>
                                </Grid>

                                <Grid item xs={12}></Grid>

                                <Grid item xs={12}></Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </div>

                        <div style={{ width: "95%", marginBottom: "20px" }}>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="size-content"
                              id="size-header"
                            >
                              <Typography className={classes.heading}>
                                سایز
                              </Typography>

                              {
                                productSizes.map( (tag,index) => (
                                    <span style={{marginRight:"10px", color: "#922c88"}}>
                                        {index === 0 ? '( ' : ''}
                                         {tag}
                                         {index === (productSizes.length - 1) ? ' )' : ' , '} 
                                    </span>
                                ))
                            }
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                                spacing={3}
                              >
                                <Grid item xs={12}>
                                  <div
                                    style={{ padding: "20px", width: "100%" }}
                                  >
                                    <Grid
                                      container
                                      direction="column"
                                      justify="flex-start"
                                      alignItems="stretch"
                                      spacing={3}
                                    >
                                      <Grid item md={12} xl={9}>
                                        <Grid
                                          container
                                          direction="row"
                                          spacing={1}
                                          alignItems="flex-start"
                                        >
                                          <Grid item xs={8}>
                                            <TextField
                                              error={false}
                                              variant="outlined"
                                              fullWidth
                                              id="product-size"
                                              label="سایز"
                                              placeholder={
                                                isMobile
                                                  ? ""
                                                  : "سایز مورد نظر خود را بنویسید و enter بزنید"
                                              }
                                              autoComplete="none"
                                              value={newSize}
                                              onChange={newSizeChanged}
                                              onKeyDown={newSizePressed}
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            xs={1}
                                            style={{ paddingTop: "0px" }}
                                          >
                                            <Tooltip title="اضافه کردن سایز جدید">
                                              <IconButton
                                                color="secondary"
                                                aria-label="add new size"
                                                onClick={newSizeClicked}
                                              >
                                                <AddBoxIcon
                                                  style={{ fontSize: "2.5rem" }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                          {productSizes &&
                                            productSizes.length > 0 &&
                                            productSizes.map((tag, index) => (
                                              <Grid
                                                item
                                                xs={6}
                                                sm={6}
                                                md={4}
                                                lg={2}
                                                direction="row"
                                                justify="flex-end"
                                                alignItems="flex-start"
                                              >
                                                <Chip
                                                  label={tag}
                                                  variant="outlined"
                                                  onDelete={() =>
                                                    deleteSizeAtIndex(index)
                                                  }
                                                />
                                              </Grid>
                                            ))}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </div>
                                </Grid>

                                <Grid item xs={12}></Grid>

                                <Grid item xs={12}></Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </div>

                        <div style={{ width: "95%", marginBottom: "20px" }}>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="material-content"
                              id="material-header"
                            >
                              <Typography className={classes.heading}>
                                جنس
                              </Typography>
                              {
                                productMaterials.map( (tag,index) => (
                                    <span style={{marginRight:"10px", color: "#922c88"}}>
                                        {index === 0 ? '( ' : ''}
                                         {tag}
                                         {index === (productMaterials.length - 1) ? ' )' : ' , '} 
                                    </span>
                                ))
                              }
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                                spacing={3}
                              >
                                <Grid item xs={12}>
                                  <div
                                    style={{ padding: "20px", width: "100%" }}
                                  >
                                    <Grid
                                      container
                                      direction="column"
                                      justify="flex-start"
                                      alignItems="stretch"
                                      spacing={3}
                                    >
                                      <Grid item md={12} xl={9}>
                                        <Grid
                                          container
                                          direction="row"
                                          spacing={1}
                                          alignItems="flex-start"
                                        >
                                          <Grid item xs={8}>
                                            <TextField
                                              error={false}
                                              variant="outlined"
                                              fullWidth
                                              id="product-material"
                                              label="جنس"
                                              placeholder={
                                                isMobile
                                                  ? ""
                                                  : "جنس مورد نظر خود را بنویسید و enter بزنید"
                                              }
                                              autoComplete="none"
                                              value={newMaterial}
                                              onChange={newMaterialChanged}
                                              onKeyDown={newMaterialPressed}
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            xs={1}
                                            style={{ paddingTop: "0px" }}
                                          >
                                            <Tooltip title="اضافه کردن جنس جدید">
                                              <IconButton
                                                color="secondary"
                                                aria-label="add new material"
                                                onClick={newMaterialClicked}
                                              >
                                                <AddBoxIcon
                                                  style={{ fontSize: "2.5rem" }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                          {productMaterials &&
                                            productMaterials.length > 0 &&
                                            productMaterials.map(
                                              (tag, index) => (
                                                <Grid
                                                  item
                                                  xs={6}
                                                  sm={6}
                                                  md={4}
                                                  lg={2}
                                                  direction="row"
                                                  justify="flex-end"
                                                  alignItems="flex-start"
                                                >
                                                  <Chip
                                                    label={tag}
                                                    variant="outlined"
                                                    onDelete={() =>
                                                      deleteMaterialAtIndex(
                                                        index
                                                      )
                                                    }
                                                  />
                                                </Grid>
                                              )
                                            )}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </div>
                                </Grid>

                                <Grid item xs={12}></Grid>

                                <Grid item xs={12}></Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </div>

                        <div style={{ width: "95%", marginBottom: "20px" }}>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="model-content"
                              id="model-header"
                            >
                              <Typography className={classes.heading}>
                                مدل
                              </Typography>

                              {
                                productModels.map( (tag,index) => (
                                    <span style={{marginRight:"10px", color: "#922c88"}}>
                                        {index === 0 ? '( ' : ''}
                                         {tag}
                                         {index === (productModels.length - 1) ? ' )' : ' , '} 
                                    </span>
                                ))
                              }
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                                spacing={3}
                              >
                                <Grid item xs={12}>
                                  <div
                                    style={{ padding: "20px", width: "100%" }}
                                  >
                                    <Grid
                                      container
                                      direction="column"
                                      justify="flex-start"
                                      alignItems="stretch"
                                      spacing={3}
                                    >
                                      <Grid item md={12} xl={9}>
                                        <Grid
                                          container
                                          direction="row"
                                          spacing={1}
                                          alignItems="flex-start"
                                        >
                                          <Grid item xs={8}>
                                            <TextField
                                              error={false}
                                              variant="outlined"
                                              fullWidth
                                              id="product-model"
                                              label="مدل"
                                              placeholder={
                                                isMobile
                                                  ? ""
                                                  : "مدل مورد نظر خود را بنویسید و enter بزنید"
                                              }
                                              autoComplete="none"
                                              value={newModel}
                                              onChange={newModelChanged}
                                              onKeyDown={newModelPressed}
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            xs={1}
                                            style={{ paddingTop: "0px" }}
                                          >
                                            <Tooltip title="اضافه کردن مدل جدید">
                                              <IconButton
                                                color="secondary"
                                                aria-label="add new model"
                                                onClick={newModelClicked}
                                              >
                                                <AddBoxIcon
                                                  style={{ fontSize: "2.5rem" }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                          {productModels &&
                                            productModels.length > 0 &&
                                            productModels.map((tag, index) => (
                                              <Grid
                                                item
                                                xs={6}
                                                sm={6}
                                                md={4}
                                                lg={2}
                                                direction="row"
                                                justify="flex-end"
                                                alignItems="flex-start"
                                              >
                                                <Chip
                                                  label={tag}
                                                  variant="outlined"
                                                  onDelete={() =>
                                                    deleteModelAtIndex(index)
                                                  }
                                                />
                                              </Grid>
                                            ))}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </div>
                                </Grid>

                                <Grid item xs={12}></Grid>

                                <Grid item xs={12}></Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
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

                        <div style={{ padding: "20px", width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                            spacing={3}
                          >
                            <Grid item md={12} xl={8}>
                              <Grid
                                container
                                direction="row"
                                spacing={0}
                                alignItems="flex-start"
                              >
                                <Grid item xs={10}>
                                  <TextField
                                    error={false}
                                    variant="outlined"
                                    id="product-hashtag"
                                    label="برچسب جدید"
                                    placeholder={
                                      isMobile
                                        ? ""
                                        : "کلمه مورد نظر خود را بنویسید و enter بزنید"
                                    }
                                    autoComplete="none"
                                    value={newHashTag}
                                    helperText="برچسب ها به جستجوی هدفمند محصول شما در فروشگاه و در سطح اینترنت کمک می نماید. لطفا در انتخاب برچسب ها دقت نمائید و فقط از کلمات مرتبط با محصول خود استفاده نمائید."
                                    onChange={newHashTagChanged}
                                    onKeyDown={newHashTagPressed}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          #
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={1} style={{ paddingTop: "0px" }}>
                                  <Tooltip title="اضافه کردن برچسب جدید">
                                    <IconButton
                                      color="secondary"
                                      aria-label="add new hashtag"
                                      onClick={newHashTagClicked}
                                    >
                                      <AddBoxIcon
                                        style={{ fontSize: "2.5rem" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                {hashTags &&
                                  hashTags.length > 0 &&
                                  hashTags.map((tag, index) => (
                                    <Grid item xs={12} sm>
                                      <Chip
                                        label={tag}
                                        variant="outlined"
                                        onDelete={() =>
                                          deleteHashTagAtIndex(index)
                                        }
                                      />
                                    </Grid>
                                  ))}
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

function getImages(postImages) {
  const result = [];
  if (postImages) {
    postImages.forEach((post) => {
      result.push({ original: post.imageUrl, thumbnail: post.imageUrlSmall });
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
