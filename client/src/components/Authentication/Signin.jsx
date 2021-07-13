import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
//import React, { useState } from 'react'
import './style.css'
import { Redirect } from 'react-router-dom';
import Base from '../Base/Base';
import { authenticate } from './auth/index';
import Footer from "../Footer/Footer";
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                TeamClone
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function Signin() {
    const classes = useStyles();
    const [userpost, setUser] = useState({
        email: '',
        password: '',
    });

    const [created, setCreated] = useState(false);

    const handleChange = (event) => {
        setUser({
            ...userpost,
            [event.target.name]: event.target.value
        })
    }

    const postEvent = async () => {

        try {
            const res = await axios.post(`/user/signin`, userpost);
            console.log(res);
            if (res.data.isMatch === false) {
                window.alert(res);
                return;
            }
            else {
                console.log(res.data);
                window.alert(res.data.user.fname + " logged in successfully !!");
            }

            authenticate({
                token: res.data.token,
                user: res.data.user
            });

            setCreated(true);

        } catch (err) {

            console.log(err.response);
            window.alert("wrong credentials");

            return;
        }

    }

    const onSubmit = (e) => {
        e.preventDefault();
        userpost.email = userpost.email.trim();
        userpost.password = userpost.password.trim();

        if (userpost.email === "" || userpost.password === "") {
            window.alert("All fields are compulsory");
            return;
        }
        postEvent();
    }

    if (created) {
        return <Redirect to="/"></Redirect>
    }

    return (
        <>
            <Base>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={userpost.email}
                                onChange={handleChange}
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                value={userpost.password}
                                onChange={handleChange}
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={onSubmit}
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/signup" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Container>
            </Base>
            <Footer></Footer>
        </>
    )
}
