import React from 'react';
import { Link } from 'react-router-dom';


const Navigation = ({ userObj }) => {


  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile" >{userObj.displayName ? userObj.displayName : userObj.email.split('@')[0]}의 profile</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;
