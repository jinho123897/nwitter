import { authService, dbService } from 'fbase'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  }
  const getMyNweets = async() => {
    const nweets = await dbService.collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
  };
  useEffect(() => {
    getMyNweets();
  }, []);

  useEffect(() => {
    if (userObj.displayName === null) {
      const name = userObj.email.split('@')[0];
      setNewDisplayName(name);
    } else {
      setNewDisplayName(userObj.displayName);
    }
  },[userObj])

  const onChange = (event) => {
    const {target: {value}} = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName){
      await userObj.updateProfile({displayName : newDisplayName});
    }
    refreshUser();
  }


  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder='Display name' onChange={onChange} value={newDisplayName}/>
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile;
