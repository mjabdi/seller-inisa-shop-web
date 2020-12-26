import React, { Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
// import GlobalStyles from "./GlobalStyles";
import * as serviceWorker from "./serviceWorker";

import GlobalState from "./GlobalState";
import Navigator from './Navigator';

import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function App() {
  const [state, setState] = React.useState({currentMenuIndex:0});

  return (
    // <h1 style={{textAlign: "center", paddingTop:"50px"}}> به پنل فروشندگان اینیسا شاپ خوش آمدید</h1>
    <GlobalState.Provider value={[state, setState]}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {/* <GlobalStyles /> */}

          <StylesProvider jss={jss}>

              <Navigator/>

          </StylesProvider>


        </MuiThemeProvider>
      </BrowserRouter>
    </GlobalState.Provider>
  );
}

serviceWorker.register();

export default App;
