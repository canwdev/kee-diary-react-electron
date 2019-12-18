import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Grid, Paper} from "@material-ui/core"
import AutoRedirectLogin from "../components/AutoRedirectLogin"
import GroupsList from "../components/GroupsList"
import EntriesList from "../components/EntriesList"
import {useSelector} from "react-redux"
import {selectorIsListView} from "../store/getters"

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(0),
    overflowX: 'auto'
  },
}));
export default function () {
  const classes = useStyles();
  const isListView = useSelector(selectorIsListView)

  return (
    <Container maxWidth="xl">
      <AutoRedirectLogin/>
      {
        isListView ? (
          <Grid container spacing={1}>
            <Grid item xl={2} md={3} sm={2} xs={12}>
              <Paper className={classes.paper}>
                <GroupsList/>
              </Paper>
            </Grid>
            <Grid item xl={10} md={9} sm={10} xs={12}>
              <EntriesList/>
            </Grid>
          </Grid>
        ) : (
          <Paper className={classes.paper}>
            <h1>日历视图</h1>
            <p>敬请期待</p>
          </Paper>
        )
      }
    </Container>
  )
}
