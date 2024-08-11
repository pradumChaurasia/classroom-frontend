import React from 'react'
import { PiNotepadBold } from "react-icons/pi";
import './Header.css'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/userActions';

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/');
    };
    return (
        <div className='header'>
            <div>
                <PiNotepadBold style={{ color: 'white', fontSize: '30px' }} />
            </div>
            <div className='header-container'>
                {user ? (<div>
                    <div className='signup-button' onClick={handleLogout}>
                    Logout
                </div>
                </div>):(
                    <>
                <div className='login-header' onClick={() => navigate('/student-signin')}>
                    Login Student 
                </div>
                <div className='login-header' onClick={() => navigate('/teacher-signin')}>
                    Login Teacher
                </div>
                <div className='login-header' onClick={() => navigate('/principal-signin')}>
                    Login Principal
                </div>
                </>
                )
                }

            </div>
        </div>
    )
}

export default Header