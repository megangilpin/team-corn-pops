import * as React from "react";

import { Typography, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Formik, Form, Field } from "formik";
import { TextField, CheckboxWithLabel } from "formik-material-ui";

import * as Yup from "yup";

const useStyles = makeStyles({
    formItem: {
        margin: "2vh 0vw 2vh 0vw",
        textAlign: "left",
    },
    formContainer: {
        marginLeft: "5vw",
    },
});

export default function SignUp() {
    const classes = useStyles();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required("Required!"),
        password: Yup.string().min(6).required("Required!"),
    });
    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
                chef: false,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    setSubmitting(false);
                    alert(JSON.stringify(values, null, 2));
                }, 500);
            }}
        >
            {({ submitForm, isSubmitting }) => (
                <Form>
                    <Grid
                        className={classes.formContainer}
                        container
                        justify="flex-start"
                    >
                        <Grid className={classes.formItem} item xs={12}>
                            <Typography variant="h5" component="h2">
                                Create an account
                            </Typography>
                        </Grid>

                        <Grid className={classes.formItem} item xs={12}>
                            <Field
                                component={TextField}
                                variant="outlined"
                                name="email"
                                type="email"
                                label="Email"
                            />
                        </Grid>
                        <Grid className={classes.formItem} item xs={12}>
                            <Field
                                component={TextField}
                                variant="outlined"
                                name="password"
                                type="password"
                                label="Password"
                            />
                        </Grid>
                        <Grid className={classes.formItem} item xs={12}>
                            <Field
                                component={CheckboxWithLabel}
                                type="checkbox"
                                name="chef"
                                Label={{ label: "Sign up as chef!" }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                className={classes.formItem}
                                color="primary"
                                variant="contained"
                                disabled={isSubmitting}
                                onClick={submitForm}
                            >
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}