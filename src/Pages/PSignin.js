import React, { useState } from 'react'
import './signin.css';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/actions/userActions.js';

const PSignin = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState({
        email:"",
        password:"",
    });

    const handleChange= (e)=>{
        
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        let isValid = true;

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

        return { isValid, errors };
    };
    const handleLogin = async () => {
        const { isValid, errors } = validate(formValues);
        
        if (isValid) {
            try {
                const response = await axios.post(`http://localhost:3000/api/user/login`, {
                    email: formValues.email,
                    password: formValues.password,
                });
                if (response.data) {
                    const { token, user } = response.data;
                    localStorage.setItem("token", JSON.stringify(token));
                    dispatch(loginSuccess({ token, ...user }));
                    toast.success("Login Successfully!", {
                        autoClose: 3000
                    });
                    navigate('/pdashboard');
                }
            } catch (error) {
                console.log("error : ", error);
                toast.error("Error in Login", {
                   autoClose: 3000
                });
            }
        } else {
            const error = Object.values(errors);
            toast.error(error[0] ? error[0] : "All fields are required", {
                autoClose: 3000
              });
        }
    };

   
    return (    
            <>
            <div className='login-container'>
                <div className='login-heading'>Principal Login</div>
                <div className='login-sub-container'>
                    <div className="inputs">
                        <input
                            type="email"
                            placeholder='Email'
                            name='email'
                            onChange={handleChange}
                            value={formValues.email}
                        />
                        <input
                            type="password"
                            placeholder='Password'
                            name='password'
                            onChange={handleChange}
                            value={formValues.password}
                        />
                    </div>
                    <button className='login-button' onClick={handleLogin}>Login</button>
                   
                   
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default PSignin