import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Container} from "@material-ui/core"
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import GroupsList from "../components/GroupsList"
import GroupsDetail from "../components/GroupsDetail"

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(0),
    overflowX: 'auto'
  },
}));

export default function () {
  const classes = useStyles();
  return (
    <Container maxWidth={"xl"}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Paper className={classes.paper}>
            <GroupsList/>
          </Paper>
        </Grid>
        <Grid item md={9} xs={12}>
          <GroupsDetail/>
        </Grid>
      </Grid>
    </Container>
  )
}
