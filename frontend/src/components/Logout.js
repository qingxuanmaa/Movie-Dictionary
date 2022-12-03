import React from 'react';
import { googleLogout } from '@react-oauth/google';
import { Button } from 'react-bootstrap';

export default function Logout({ setUser }){
    const handleLogout= () => {
        googleLogout();
        setUser(null);
        localStorage.setItem("login", null); // clearing local storage
        console.log('Logout made successfully');
        
    }
    return (
        <div>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
    )
    
}

