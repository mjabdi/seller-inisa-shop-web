import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import {
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Tooltip,
} from "@material-ui/core";
import GlobalState from "./GlobalState";
import { List, ListItem } from "@material-ui/core";

import ListItemText from "@material-ui/core/ListItemText";
import { MenuList , getMenuId } from "./MenuList";
import { border, borderBottom } from "@material-ui/system";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },

  icon: {
    fontSize: "1rem",
    color: "#777",
    cursor: "pointer",
    paddingTop: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
  },

  iconSelected: {
    color: theme.palette.secondary.main,
  },
}));

export default function Menu() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  let history = useHistory();

  useEffect(() => {
    setSelectedIndex(state.currentMenuIndex);
  }, [state.currentMenuIndex]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    history.push(`/${getMenuId(index)}`);
    setState((state) => ({ ...state, currentMenuIndex: index }));
  };

  return (
    <React.Fragment>
      <List>
        {MenuList.map(
          (item) =>
            !item.hidden && (
              // <ListItem button selected={selectedIndex === item.index} onClick={(event) => handleListItemClick(event, item.index)}>
              // <ListItemIcon>
              //     {item.icon}
              // </ListItemIcon>
              // <ListItemText primary={`${item.title}`} />
              // </ListItem>
              <React.Fragment key={`${item.id}`}>
                <div key={`${item.id}`}
                  className={clsx(
                    classes.icon,
                    selectedIndex === item.index && classes.iconSelected
                  )}
                  onClick={(event) => handleListItemClick(event, item.index)}
                >
                  <Grid 
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item>{item.icon}</Grid>

                    <Grid item>{`${item.title}`}</Grid>
                  </Grid>
                </div>
              </React.Fragment>
            )
        )}
      </List>
    </React.Fragment>
  );
}
