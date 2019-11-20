import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Grid, Paper} from "@material-ui/core"

import AutoRedirectLogin from "../components/AutoRedirectLogin"
import GroupsList from "../components/GroupsList"
import EntriesList from "../components/EntriesList"

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(0),
    overflowX: 'auto'
  },
}));

export default function () {
  const classes = useStyles();
  return (
    <Container maxWidth="xl">
      <AutoRedirectLogin/>
      <Grid container spacing={1}>
        <Grid item xl={2} md={3} xs={12}>
          <Paper className={classes.paper}>
            <GroupsList/>
          </Paper>
        </Grid>
        <Grid item xl={10} md={9} xs={12}>
          <EntriesList/>
        </Grid>
      </Grid>
    </Container>
  )
}
