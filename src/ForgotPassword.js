import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import * as EmailValidator from "email-validator";

import {
  Grid,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";
import Copyright from "./CopyRight";

import { useHistory } from "react-router-dom";
import UserService from "./services/UserService";

const ERROR_MESSAGE = "متاسفانه مشکلی در سیستم بوجود آمده است، لطفا دوباره تلاش کنید"


const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(/images/login-bg.png)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "40vw 22vw",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    color: "#fff"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#f5f5f5",
    marginBottom: "30px"
  },

  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  alert: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  timeLeft: {
    color: theme.palette.secondary.main,
    // backgroundColor: "#333",
    border: "1px solid",
    borderColor: "#ccc",
    borderRadius : "5px",
    marginLeft: theme.spacing(1),
    padding: "2px",
    paddingLeft: "10px",
    paddingRight: "10px",
    fontWeight: "500",
  },


}));

const timeFormat = (num) => {

  const min = parseInt(num / 60);
  const seconds = num - min * 60;

  let minStr = `${min}`;
  if (minStr.length === 1) {
    minStr = `0${minStr}`;
  }


  let secondsStr = `${seconds}`;
  if (secondsStr.length === 1) {
    secondsStr = `0${secondsStr}`;
  }

  return `${secondsStr} : ${minStr} `;
};
export default function ForgotPassword() {
  const classes = useStyles();

  const [password, setPassword] = React.useState("");
  const [passwordRepeat, setPasswordRepeat] = React.useState("");

  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [verificationCode, setVerificationCode] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [submiting, setSubmiting] = React.useState(false);

  const [error, setError] = React.useState(null);
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordRepeatError, setPasswordRepeatError] = React.useState(false);
  const [verificationCodeError, setVerificationCodeError] = React.useState(
    false
  );

  const [successfullyFinished, setSuccessfullyFinished] = React.useState(false);

  const [timeLeft, setTimeLeft] = React.useState(0);

  const [verificationCodeSent, setVerificationCodeSent] = React.useState(false);

  const validate = () => {
    let error = false;
  
    if (
      !username ||
      username.trim().length < 10 ||
      !username.trim().startsWith('9') || 
      (parseInt(username).toString().length < 10)
    ) {
      error = true;
      setUsernameError(true);
    }
   
    return !error;
  };

  const validateStepTwo = () => {
    let error = false;
  
    if (!verificationCode || verificationCode.trim().length < 1) {
      setVerificationCodeError(true);
      error = true;
    }
    if (!password || password.trim().length < 1) {
      error = true;
      setPasswordError(true);
    }
    if (!passwordRepeat || passwordRepeat.trim().length < 1) {
      error = true;
      setPasswordRepeatError(true);
    }

    if (error)
        return false

    if (
      password &&
      passwordRepeat &&
      password.trim() !== passwordRepeat.trim()
    ) {
      error = true;
      setPasswordError(true);
      setPasswordRepeatError(true);
      setError("رمز عبور و تکرار آن یکسان نمی باشند");
    }

    if (error)
     return false

    if (password.trim().length < 6) {
      error = true;
      setPasswordError(true);
      setPasswordRepeatError(true);
      setError("رمز عبور باید حداقل شامل 6 کاراکتر باشد");
    }

    return !error;
  };

  const MAX_TIME_OUT = 2 * 60; //seconds
  const initTimer = () => {
    setTimeLeft(MAX_TIME_OUT);
    const timer = setInterval(() => {
      setTimeLeft((prevValue) => (prevValue > 0 ? prevValue - 1 : 0));
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
    }, MAX_TIME_OUT * 1000 + 5000);
  };

  const resetPassword = () => {

    if (!validateStepTwo()) {
      return;
    }

    setSubmiting(true);
    const payload = {
      userId: username,
      verficationCode: verificationCode,
      password: password
    };
    UserService.resetPassword(payload)
      .then((res) => {
        setSubmiting(false);
        if (res.data.status === "OK") {
          setSuccessfullyFinished(true);
        } else if (res.data.status === "FAILED") {
          setError(res.data.error);
          if (res.data.error.startsWith('expired!'))
          {
            setError(res.data.error.substr('expired!'.length))
            setTimeLeft(0)  
          }
        } else {
          setError(ERROR_MESSAGE);
        }
      })
      .catch((err) => {
        setSubmiting(false);
        console.error(err);
        setError(ERROR_MESSAGE);
      });
  };

  const sendForgotPasswordEmail = () => {
   
    if (validate()) {
      setError(null);
      setSubmiting(true);
      const payload = {
        userId: username
      };

      UserService.forgotPassword(payload)
        .then((res) => {
          setSubmiting(false);
          if (res.data.status === "OK") {
            setVerificationCodeSent(true);
            setVerificationCode('')
            initTimer();
          } else if (res.data.status === "FAILED") {
            setError(res.data.error);
          } else {
            setError(ERROR_MESSAGE);
          }
        })
        .catch((err) => {
          console.error(err);
          setSubmiting(false);
          setError(ERROR_MESSAGE);
        });
    }
  };


  const verificationCodeChanged = (event) => {
    setVerificationCode(event.target.value);
    setVerificationCodeError(false);
  };

 

  const usernameChanged = (event) => {
    setUsername(event.target.value);
    setUsernameError(false);
  };

  const passwordChanged = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
    setPasswordRepeatError(false);
  };

  const passwordRepeatChanged = (event) => {
    setPasswordRepeat(event.target.value);
    setPasswordError(false);
    setPasswordRepeatError(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Grid
      container
      component="main"
      className={classes.root}
      direction="row-reverse"
    >
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            رمز عبور خود را فراموش کرده اید؟
          </Typography>

          {error && !successfullyFinished && (
            <div className={classes.alert}>
              <Alert severity="error">
                {" "}
                <div style={{ lineHeight: "1.5rem", textAlign: "justify" }}>
                  {error}
                </div>
              </Alert>
            </div>
          )}

          {successfullyFinished && (
            <div className={classes.alert}>
              <Alert severity="success">
                <div
                  style={{
                    lineHeight: "2.5rem",
                    fontSize: "1rem",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  رمز عبور شما با موفقیت تغییر کرد
                </div>
              </Alert>
            </div>
          )}

          {verificationCodeSent && !successfullyFinished && (
            <React.Fragment>
              {!error && timeLeft > 0 && (
                <div className={classes.alert}>
                  <Alert severity="info">
                    <div style={{ lineHeight: "1.5rem", textAlign: "justify" }}>
                      کد تائید برای تلفن همراه شما ارسال گردید، لطفا کد ارسال
                      شده را در باکس زیر وارد نمائید
                    </div>
                  </Alert>
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  marginBottom: "30px",
                  marginTop: "30px",
                }}
              >
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                  spacing={2}
                >
                  {timeLeft > 0 && (
                    <Grid item>
                      <span style={{ color: "#777" }}>
                        اعتبار کد ارسال شده تا :{" "}
                        <span className={classes.timeLeft}>
                          {" "}
                          {timeFormat(timeLeft)}{" "}
                        </span>
                      </span>
                    </Grid>
                  )}

                  {timeLeft === 0 && (
                    <Grid item xs={12} sm={8}>
                      <div className={classes.alert}>
                        <Alert severity="error">
                          {" "}
                          <div
                            style={{
                              lineHeight: "1.5rem",
                              textAlign: "justify",
                              color: "#333",
                            }}
                          >
                            کد ارسال شده منقضی شد !
                          </div>
                        </Alert>
                      </div>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={4}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        disabled={timeLeft > 0}
                        style={{ padding: "10px", color: "#fff" }}
                        variant="contained"
                        color="secondary"
                        onClick={sendForgotPasswordEmail}
                      >
                        ارسال کد جدید
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </React.Fragment>
          )}

          {!verificationCodeSent && !successfullyFinished && (
            <React.Fragment>
              <div
                style={{
                  color: "#777",
                  paddingTop: "20px",
                  paddingBottom: "0px",
                  fontSize: ".95rem",
                  lineHeight: "1.8rem",
                  textAlign: "center",
                }}
              >
                <p>
                  برای تغییر رمز عبور، لطفا شماره تلفن همراه که با آن ثبت نام
                  کرده اید را وارد نمائید.
                </p>
                <p>
                  {" "}
                  جهت احراز هویت، یک کد تائید برای تلفن همراه شما ارسال می گردد.
                </p>
              </div>

              <TextField
                dir="ltr"
                error={usernameError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user-id"
                label="شماره تلفن همراه"
                name="username"
                autoComplete="tel"
                value={username}
                onChange={usernameChanged}
                placeholder="9*********"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+98</InputAdornment>
                  ),
                }}
                inputProps={{ maxLength: 10 }}
                autoFocus
              />
            </React.Fragment>
          )}

          {verificationCodeSent && !successfullyFinished && (
            <React.Fragment>
              <TextField
                autoFocus
                error={verificationCodeError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="verification-code-id"
                label="کد تائید"
                name="verification-code"
                autoComplete="none"
                value={verificationCode}
                onChange={verificationCodeChanged}
                helperText="لطفا کد تائید که به تلفن همراه شما ارسال شده است را وارد نمائید"
              />

              <FormControl
                fullWidth
                required
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  {" "}
                  رمز عبور جدید{" "}
                </InputLabel>
                <OutlinedInput
                  error={passwordError}
                  id="outlined-adornment-password"
                  name="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={passwordChanged}
                  autoComplete="new-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        tabindex="-1"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={150}
                />
              </FormControl>

              <FormControl
                fullWidth
                required
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  {" "}
                  تکرار رمز عبور جدید{" "}
                </InputLabel>
                <OutlinedInput
                  error={passwordRepeatError}
                  id="outlined-adornment-repeat-password"
                  name="outlined-adornment-repeat-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordRepeat}
                  onChange={passwordRepeatChanged}
                  autoComplete="new-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        tabindex="-1"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={200}
                />
              </FormControl>
            </React.Fragment>
          )}

          {!verificationCodeSent && !successfullyFinished && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={sendForgotPasswordEmail}
              className={classes.submit}
            >
              ارسال کد
            </Button>
          )}

          {verificationCodeSent && !successfullyFinished && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={resetPassword}
              className={classes.submit}
            >
              تائید
            </Button>
          )}

          <Grid container>
            {successfullyFinished && (
              <Grid item xs={12}>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Link  color="secondary" href="/login" variant="body2">
                    {"برگشت به صفحه ورود به سیستم"}
                  </Link>
                </div>
              </Grid>
            )}

            {!successfullyFinished && (
              <Grid item xs={12} style={{ width: "100%", textAlign: "right" }}>
                <Link color="secondary" href="/login" variant="body2">
                  {"برگشت به صفحه ورود به سیستم"}
                </Link>
              </Grid>
            )}
          </Grid>

          <Backdrop className={classes.backdrop} open={submiting}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <CircularProgress color="inherit" />
              </Grid>
              <Grid item>
                <span style={{ textAlign: "center", color: "#fff" }}>
                  {" "}
                  لطفا چند لحظه صبر نمائید ...{" "}
                </span>
              </Grid>
            </Grid>
          </Backdrop>

          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
