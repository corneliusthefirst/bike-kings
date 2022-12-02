import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup } from 'reactstrap';

//Import action
import { apiError } from '../../../redux/authSlice/authSlice';

//i18n
import { useTranslation } from 'react-i18next';
import { register } from '../../../redux/authSlice/async-functions';

//Import Images
import logo from "../../../assets/logo.png";


/**
 * Register component
 * @param {*} props 
 */
const Register = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const clearError = () => {
        dispatch(apiError(""));
    }

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    useEffect(clearError);

    // validation
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string().email('Enter proper email').required('Required'),
            password: Yup.string()
                .required('Required')
        }),
        onSubmit: values => {
            console.log("val1",values);
            dispatch(register({user: values, navigate , setIsAuthenticated: props.setIsAuthenticated}));
        },
    });


    return (
        <React.Fragment>

            <div className="account-pages w-full my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <div className="text-center mb-4">
                                <Link to="/" className="auth-logo mb-5 d-block">
                                    <img src={logo} alt="" width="150px" className="logo logo-dark" />
                                </Link>

                                <h4>{t('Sign up')}</h4>
                                <p className="text-muted mb-4">{t('Get your BikeKings account now')}.</p>

                            </div>

                            <Card>
                                <CardBody className="p-4">
                                    {
                                        props.error && <Alert variant="danger">{props.error}</Alert>
                                    }
                                    {
                                        props.user && <Alert variant="success">Thank You for registering with us!</Alert>
                                    }
                                    <div className="p-3">

                                        <Form onSubmit={formik.handleSubmit}>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Email')}</Label>
                                                <InputGroup className="input-group bg-soft-light rounded-3 mb-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-mail-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Email"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.email}
                                                        invalid={formik.touched.email && formik.errors.email ? true : false}
                                                    />
                                                    {formik.touched.email && formik.errors.email ? (
                                                        <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Username')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Username"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.username}
                                                        invalid={formik.touched.username && formik.errors.username ? true : false}
                                                    />
                                                    {formik.touched.username && formik.errors.username ? (
                                                        <FormFeedback type="invalid">{formik.errors.username}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Password"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.password}
                                                        invalid={formik.touched.password && formik.errors.password ? true : false}
                                                    />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                                                    ) : null}

                                                </InputGroup>
                                            </FormGroup>


                                            <div className="d-grid">
                                                <Button color="primary" block className=" waves-effect waves-light" type="submit">Sign up</Button>
                                            </div>

                                            <div className="mt-4 text-center">
                                                <p className="text-muted mb-0">{t('By registering you agree to the BikeKings')} <Link to="#" className="text-primary">{t('Terms of Use')}</Link></p>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                <p>{t('Already have an account')} ? <Link to="/login" className="font-weight-medium text-primary"> {t('Signin')} </Link> </p>
                                <p>© {new Date().getFullYear()} {t('BikeKings')}. </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default connect(mapStateToProps, { apiError })(Register);