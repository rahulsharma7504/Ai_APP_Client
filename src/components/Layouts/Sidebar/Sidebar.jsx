import React,{ useState, useEffect } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import Menu from '../Menu/Menu';

const Sidebar = () => {
    const navigate = useNavigate();

    const [ sidebarActive, setSidebarActive ] = useState('');
    const [ currentUserName, setCurrentUserName ] = useState('');
    const [ isAdmin, setIsAdmin ] = useState(false);
    const userData = AuthService.getUserData();

    const sidebarToggle = () => {
        if(sidebarActive != ''){
            setSidebarActive('');
        }
        else{
            setSidebarActive('active');
        }
    }

    useEffect(()=>{
        setCurrentUserName(userData.name);
        setIsAdmin(userData.is_admin);
    },[]);

    const handleLogout = () => {
        AuthService.logoutUser();
        navigate('/login', { replace: true });
    };

    return (
        <nav id="sidebar" className={ sidebarActive }>
            <div className="custom-menu">
                <button type="button" id="sidebarCollapse" onClick={ sidebarToggle } className="btn btn-primary">
                    <i className="fa fa-bars"></i>
                    <span className="sr-only">Toggle Menu</span>
                </button>
            </div>
            <div className="topbar">
                <a href="#">Hii, { currentUserName }</a>
                <button className='btn btn-secondary logoutBtn' onClick={handleLogout}>Log Out</button>
            </div>
            <div className='text-center'>
                
            </div>

            <Menu/>
            
            
        </nav>
    );
}

export default Sidebar;