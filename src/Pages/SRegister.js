import React, { useState } from 'react'
import './signin.css';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/actions/userActions';

const SRegister = () => {

    const dispatch = useDispatch()
    const { token, user } = useSelector(state => state.user)
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        rollNumber: "",
        role: "Student"
    });

    const handleChange = (e) => {

        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
    }
    const navigate = useNavigate()

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        let isValid = true;
        if (!values.firstName) {
            errors.firstName = "Please Enter First Name";
            isValid = false;
        }

        if (!values.lastName) {
            errors.lastName = "Please Enter Last Name";
            isValid = false;
        }

        if (!values.email) {
            errors.email = "Please Enter Email";
            isValid = false;
        } else if (!regex.test(values.email)) {
            errors.email = "Please Enter Valid Email";
            isValid = false;
        }

        if (!values.password) {
            errors.password = "Please Enter Password";
            isValid = false;
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = "Please Enter Confirm Password";
            isValid = false;
        }

        if (values.password !== values.confirmPassword) {
            errors.notMatch = "Password and Confirm Password must be same";
            isValid = false;
        }

        if (values.phoneNumber === "") {
            errors.phoneNumber = "Please Enter a Phone Number"
            isValid = false;
        }

        if (values.rollNumber === "") {
            errors.phoneNumber = "Please Enter a Roll Number"
            isValid = false;
        }

        return { isValid, errors };
    };

    const handleSignUp = async () => {
        const { isValid, errors } = validate(formValues);

        if (isValid) {

            try {
                // await axios.post(`http://localhost:3000/api/user/register`, {
                await axios.post(`https://classroom-backend-alpha.vercel.app/api/user/register`, {
                    email: formValues.email,
                    password: formValues.password,
                    name: `${formValues.firstName} ${formValues.lastName}`,
                    role: formValues.role,
                    phoneNumber: formValues.phoneNumber,
                    rollNumber: formValues.rollNumber,
                    creatorEmail: user?.email
                });
                toast.success("Student Registered Successfully!", {
                    autoClose: 3000
                });

                user.role === "Principal" ? navigate('/pdashboard') : navigate('/tdashboard')
            } catch (error) {
                toast.error(error.response?.data?.message || "Registration failed!", {
                    autoClose: 3000
                });
            }
        } else {
            const error = Object.values(errors);
            toast.error(error[0] ? error[0] : "All fields are required", {
                autoClose: 3000
            });
        }
    }
    return (
        <>
            <div className='login-container'>
                <div className='login-heading'>
                    Register Student
                </div>
                <div className='login-sub-container'>
                    <div className="inputs">
                        <input
                            type="text"
                            placeholder='First Name'
                            name="firstName"
                            value={formValues.firstName}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder='Last Name'
                            name="lastName"
                            value={formValues.lastName}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            placeholder='Email'
                            name='email'
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder='Password'
                            name='password'
                            value={formValues.password}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            placeholder='Phone Number'
                            name='phoneNumber'
                            value={formValues.phoneNumber}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            placeholder='Roll Number'
                            name='rollNumber'
                            value={formValues.rollNumber}
                            onChange={handleChange}
                        />
                        <input
                            type="disable"
                            name='role'
                            value={formValues.role}
                            readOnly
                            disabled
                        />
                    </div>
                    <button className='login-button' onClick={handleSignUp}>Sign UP</button>


                </div>

            </div>
            <ToastContainer />
        </>
    )
}

export default SRegister