import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import React, {useEffect, useState} from 'react'
import Nweet from 'components/Nweet'

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachMent] = useState("");
  useEffect(() => {
    dbService.collection("nweets").onSnapshot(snapshot => {
      const nweetArray = snapshot.docs.map( doc => ({
        id: doc.id, 
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  },[])

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if(attachment !== ""){
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    }
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachMent("");
  }

  const onChange = (event) => {
    const {target: {value}} = event;
    setNweet(value);
  }

  const onFileChange = (event) => {
    const {target: {files}} = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {currentTarget: {result}} = finishedEvent;
      setAttachMent(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment = () => {
    setAttachMent(null);
  }

  return(
    <div>
      <form onSubmit={onSubmit}> 
        <input type="text" placeholder="What's on your mind?" value={nweet} onChange={onChange} maxLength={120} />
        <input type="file" accept='image/*' onChange={onFileChange}/>
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} style={{width: 50, height: 50}}/>
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      
      <div>
        {nweets.map(nweet => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  )
}

export default Home;
