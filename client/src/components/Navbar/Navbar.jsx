import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Grid from '@material-ui/core/Grid';
import { NavLink, Link } from 'react-router-dom';
import { isAuthenticated, signout } from '../Authentication/auth/index';

const logout = () => {
    signout();
}

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        color: "white",
        fontSize: "4vh",
        fontFamily: "papyrus",
        fontWeight: "500"

    },
}));

export default function NavBar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ElevationScroll {...props}>
                <AppBar position="fixed" >
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            <Link to="/" className={classes.title}>TeamClone </Link>
                        </Typography>

                        <Grid spacing={3}>
                            {
                                !isAuthenticated() && <NavLink activeClassName="active" to="/signin" className=" left" >
                                    <Button variant="contained">Sign In</Button></NavLink>
                            }
                            {
                                !isAuthenticated() && <NavLink to="/signup" activeClassName="active" className=" left" >
                                    <Button color="secondary" variant="contained">Sign Up</Button></NavLink>
                            }
                            {
                                isAuthenticated() && <Link onClick={logout} className=" left" >
                                    <Button color="secondary" variant="contained">Sign Out</Button></Link>
                            }
                        </Grid>

                    </Toolbar>
                </AppBar>
            </ElevationScroll>
        </div>
    );
}
