// WILL MOVE ADD TO CART BUTTON ONCE CHEF PROFILE PAGE IS CREATED
import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card,
    Divider,
    Avatar,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Box,
    Typography,
    Grid,
    Link,
    IconButton,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
} from "@material-ui/core";
import { theme } from "../themes/theme";
import { CartContext } from "../contexts/cart/CartContextProvider";
import { dollarFormatter } from "../lib/utils";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    root: {
        maxWidth: 225,
        borderRadius: "0px",
        boxShadow: "0px 0px 10px 5px rgba(7,7,7,0.05)",
        margin: theme.spacing(3),
    },
    small: {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    subtitle2: {
        fontSize: ".3rem",
        color: theme.palette.grey[600],
    },
    subtitle1: {
        fontWeight: "bold",
        fontSize: ".7rem",
    },
    subtitle: {
        fontWeight: "bold",
    },
});

function MealCard(props) {
    const classes = useStyles();
    const history = useHistory();
    const { chef, addToCart } = useContext(CartContext);
    const {
        mealPic,
        title,
        price,
        chefName,
        chefPic,
        location,
        id,
        chefId,
    } = props.meal;
    const [openDialog, setDialogOpen] = React.useState(false);

    const handleClose = () => {
        setDialogOpen(false);
    };

    const addMeal = (e) => {
        e.preventDefault();
        const id = parseFloat(e.currentTarget.value);
        if (chef && chefId !== chef) {
            setDialogOpen(true);
        } else {
            const meal = { id, mealPic, title, price, chefName, chefId };
            addToCart(meal);
        }
    };

    return (
        <div>
            <Card className={classes.root}>
                <CardMedia
                    component="img"
                    alt="Meal Picture"
                    height="150"
                    image={mealPic}
                    title="Meal Picture"
                />
                <CardContent>
                    <Grid item xs={12} container direction="row" spacing={2}>
                        <Grid item xs={8}>
                            <Typography gutterBottom className={classes.subtitle}>
                                {title}
                            </Typography>
                            <Typography
                                gutterBottom
                                className={classes.subtitle1}
                                color="secondary"
                            >
                                {/* assuming we save price in cents on DB */}
                                {dollarFormatter.format(price / 100)}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            container
                            justify="flex-end"
                            alignContent="center"
                        >
                            <IconButton
                                value={id}
                                color="primary"
                                variant="contained"
                                size="small"
                                onClick={addMeal}
                            >
                                <AddShoppingCartIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Box ml={1} mr={1}>
                        <Grid container spacing={1}>
                            <Grid item container spacing={2}>
                                <Grid item>
                                    <Avatar
                                        className={classes.small}
                                        alt={chefName}
                                        src={chefPic}
                                    />
                                </Grid>
                                <Grid item xs={12} sm container alignItems="center">
                                    <Grid item container direction="column">
                                        <Grid item>
                                            <Typography
                                                className={classes.subtitle}
                                                variant="subtitle1"
                                            >
                                                {chefName}
                                            </Typography>
                                            <Typography
                                                className={classes.subtitle2}
                                                gutterBottom
                                            >
                                                {location}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Link
                                    href="#"
                                    component="button"
                                    variant="body2"
                                    onClick={() => history.push("chefProfile")}
                                >
                                    Learn More
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </CardActions>
                <Box ml={1}>
                    <Button value={id} color="primary" onClick={addMeal}>
                        add to Cart
                    </Button>
                </Box>
            </Card>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Your cart already contains meals from another chef!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        A meal order can only contain meals from the same chef. If
                        you would like to select this meal please empty your current
                        cart or complete your purchase and start another order.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Got it!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MealCard;