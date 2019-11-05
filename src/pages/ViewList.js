import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Grid, Paper} from "@material-ui/core"

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
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Paper className={classes.paper}>
            <GroupsList/>
          </Paper>
        </Grid>
        <Grid item md={9} xs={12}>
          <EntriesList/>
        </Grid>
      </Grid>
    </Container>
  )
}
