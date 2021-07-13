import { makeStyles } from "@material-ui/core/styles";

import { Container, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: "black",
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
  },
  link: {
    fontSize: "1.25em",
    color: "#fff",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  copylight: {
    color: "#fff",
    fontSize: "2.5vh",
    "&:hover": {
      color: theme.palette.info.main,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.5vh",
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container justify="center" style={{ margin: "0.7em 0" }}>
          <Typography className={classes.copylight}>
            &copy; All rights reserved , Made with &hearts; by Parteek Jain
          </Typography>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
