import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Tooltip } from "@material-ui/core";
import GlobalState from "./GlobalState";

import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import WhatshotIcon from '@material-ui/icons/Whatshot';
import HistoryIcon from '@material-ui/icons/History';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 380,
  },
  cardTitle: {
    paddingBottom: "2px",
    color: theme.palette.secondary.dark,
    fontSize: "1rem",
    fontWeight: "500",
  },
  cardIcon: {
    color: theme.palette.secondary.dark,
    fontSize: "2rem",
  },
}));

export default function DashboardPreview() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={4} lg={6}>
          <Paper className={fixedHeightPaper}>
            <Grid
              container
              direction="row"
              justify="flext-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <AccessAlarmIcon className={classes.cardIcon} />
              </Grid>
              <Grid item>
                <div className={classes.cardTitle}>سفارشات باز</div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Tests Summary */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Grid
              container
              direction="row"
              justify="flext-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <HistoryIcon className={classes.cardIcon} />
              </Grid>
              <Grid item>
                <div className={classes.cardTitle}> فروش های اخیر</div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Current Visits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
          <Grid
              container
              direction="row"
              justify="flext-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <WhatshotIcon className={classes.cardIcon} />
              </Grid>
              <Grid item>
                <div className={classes.cardTitle}> پرفروش ترین ها</div>
              </Grid>
            </Grid>

          </Paper>
        </Grid>
        {/* Recent Bookings */}
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
          <Grid
              container
              direction="row"
              justify="flext-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <RecordVoiceOverIcon className={classes.cardIcon} />
              </Grid>
              <Grid item>
                <div className={classes.cardTitle}> تیکت ها</div>
              </Grid>
            </Grid>

            </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
