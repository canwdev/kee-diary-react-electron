import React from 'react';
import {Link as RouterLink} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            KeeDiary
          </Typography>
          {
            props.router.map((item, index) => {
              return (
                <Button
                  key={index}
                  color="inherit"
                  component={React.forwardRef((props, ref) => <RouterLink to={item.path} innerRef={ref} {...props} />)}
                >{item.title}</Button>
              )
            })
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}
