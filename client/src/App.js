import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import StarIcon from '@material-ui/icons/Star';
import "./App.css"
import axios from "axios"
import { format } from "timeago.js"
import Register from "./components/register"
import Login from "./components/login"
// import io from "socket.io-client"
import Messagebox from "./components/messagebox"
import storage from "./components/fire_base"
// import {ReactComponent as Men} from "./components/men.svg"
import avatar from "./components/avatar.svg"
let socket

function App() {
  const url = "http://localhost:5000/api"

  const ENDPOINT = "http://localhost:5000"



  const [msgbox, setmsgbox] = useState(false)
  const [pintype, setpintype] = useState("none")

  const [currentuser, setcurrentuser] = useState({
    _id: "",
    username: localStorage.getItem("token"),
    lat: "",
    lang: ""
  })
  const [pins, setpins] = useState([])
  const [messages, setmessages] = useState([])
  const [userpins, setuserpins] = useState([])
  const [currentplace, setcurrentplace] = useState(null)
  const [newplace, setnewplace] = useState({
    lat: 0,
    lang: 0
  })

  const [profile, setprofile] = useState(null)

  const [bioedit, setbioedit] = useState(false)
  const [bio, setbio] = useState("")
  const [showRegister, setshowRegister] = useState(false)
  const [showLogin, setshowLogin] = useState(false)
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 48.858093,
    longitude: 2.294694,
    zoom: 4,


  });

  const [rp, setrp] = useState(0)

  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [date, setdate] = useState(null)
  const [toe, settoe] = useState(null)
  const [notify, setnotify] = useState([])

  useEffect(() => {
    async function getPins() {
      try {
        const res = await axios.get(`${url}/pins`)
        console.log(res)
        setpins(res.data)

      }
      catch (err) {
        console.log(err)
      }
    }

    getPins()



  }, [])

  // useEffect(()=>{
  //   socket=io(ENDPOINT)

  //   return ()=>{

  //     socket.off()
  //   }

  // },[ENDPOINT])


  function changeBio(event) {
    event.preventDefault()
    setbio(event.target.value)

  }

  async function Setbio(event) {
    event.preventDefault()

    const r = await axios.post(`${url}/log/change`, { username: currentuser.username, c: bio, var: "Bio" })

    if (r.data === true) {
      setrp(rp + 1)
      setbioedit(false)
    }

  }

  useEffect(() => {




    if (localStorage.getItem("token")) {
      getLocation()
    }
    else {
      setshowLogin(true)
    }



  }, [])




  useEffect(() => {
    async function getUserPins() {
      try {
        const res = await axios.get(`${url}/log/userpins`)
        setuserpins(res.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    getUserPins()

  }, [rp])

  function markerClick(id, lat, lang) {
    setcurrentplace(id)
    setViewport({ ...viewport, latitude: lat, longitude: lang })
  }


  function Addplace(event) {
    const [lang, lat] = event.lngLat
    console.log(event.lngLat)
    setnewplace({
      lat,
      lang
    })

  }


  function Pin_type(event) {
    setpintype(event.target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    var newPin = {}


    if (pintype === "travel") {
      newPin = {
        username: currentuser.username,
        title,
        desc,
        rating,
        notify,
        lat: newplace.lat,
        lang: newplace.lang,
        pintype
      }
    }

    else if (pintype === "event") {
      newPin = {
        username: currentuser.username,
        title,
        desc,
        date,
        notify,
        lat: newplace.lat,
        lang: newplace.lang,
        pintype
      }
    }
    else if (pintype === "emergency") {
      newPin = {
        username: currentuser.username,
        title,
        desc,
        toe,
        notify,
        lat: newplace.lat,
        lang: newplace.lang,
        pintype
      }
    }



    try {
      const res = await axios.post(`${url}/pins/${pintype}`, newPin)
      console.log(res)
      setpins([...pins, [res.data]])
      setnewplace(null)
    }
    catch (err) {

    }


  }




  function showPins() {
    return (
      <>
        {pins.map((e) => {
          { console.log(e) }
          return (
            e.map((p) => {
              return (



                <div key={p._id}>
                  <Marker latitude={p.lat} longitude={p.lang} offsetLeft={-(viewport.zoom * 3.5)} offsetTop={-(viewport.zoom * 7)}>
                    <LocationOnIcon style={{ fontSize: viewport.zoom * 7, color: "purple", cursor: "pointer" }}
                      onClick={() => markerClick(p._id, p.lat, p.lang)}

                    />
                  </Marker>
                  {currentplace === p._id &&

                    <Popup
                      latitude={p.lat}
                      longitude={p.lang}
                      closeButton={true}
                      closeOnClick={false}
                      onClose={() => setcurrentplace(null)}
                      anchor="left" >

                      <div className="card">
                        <label>Place</label>
                        <h4 className="place">{p.title}</h4>
                        <label>Review</label>
                        <p className="desc">{p.desc}</p>
                        <label>Rating</label>
                        <div className="stars">
                          {Array(p.rating).fill(<StarIcon className="star" />)}

                        </div>
                        <label>Information</label>
                        <span className="username">Created by <b>{p.username}</b></span>
                        <span className="date">{format(p.createdAt)}</span>
                      </div>
                    </Popup>
                  }


                  {newplace &&
                    <Popup
                      latitude={newplace.lat}
                      longitude={newplace.lang}
                      closeButton={true}
                      closeOnClick={false}
                      onClose={() => {
                        setnewplace(null)
                        setpintype("none")
                      }}
                      anchor="left" >
                      <div className="card">
                        <label className="pintypelabel">Pin Type</label>
                        <select className="pintype" onChange={(event) => Pin_type(event)}>
                          <option value="travel">Travel</option>
                          <option value="event">Event</option>
                          <option value="emergency">Emergency</option>
                          <option value="family">Family</option>
                          <option value="random">Random</option>
                        </select>
                        {pintype === "travel" ? <div className="card3">
                          <label>Title</label>
                          <input placeholder="Enter a Title" onChange={(event) => setTitle(event.target.value)} />
                          <label>Review</label>
                          <textarea placeholder="Say Something about this place" onChange={(event) => setDesc(event.target.value)} />
                          <label>Rating</label>
                          <select onChange={(event) => setRating(event.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                          <label>Notify To(use # before usernames)</label>
                          <input placeholder="dont forget to add # between usernames" onChange={(event) => setnotify(event.target.value)} />
                          <button className="submitButton" onClick={(event) => handleSubmit(event)} type="submit" >Add Pin</button>

                        </div> : null}
                        {pintype === "event" ? <div className="card3">
                          <label>Title</label>
                          <input placeholder="Enter a Title" onChange={(event) => setTitle(event.target.value)} />
                          <label>Description</label>
                          <textarea placeholder="Add Description" onChange={(event) => setDesc(event.target.value)} />
                          <label>Date</label>
                          <input type="date" onChange={(event) => setdate(event.target.value)} />
                          <label>Notify To(use # before usernames)</label>
                          <input placeholder="dont forget to add # between usernames" onChange={(event) => setnotify(event.target.value)} />
                          <button className="submitButton" onClick={(event) => handleSubmit(event)} type="submit" >Add Pin</button>
                        </div> : null}
                        {pintype === "emergency" ? <div className="card3">
                          <label>Title</label>
                          <input placeholder="Enter a Title" onChange={(event) => setTitle(event.target.value)} />
                          <label>Type of Emergency</label>
                          <select >
                            <option value="ICU">ICU</option>
                            <option value="OPD">OPD</option>
                            <option value="Accident">Accident</option>
                            <option value="Covid-19">Covid-19</option>
                            <option value="Other">Other</option>
                          </select>
                          <label>Description</label>
                          <textarea placeholder="Add Description" onChange={(event) => setDesc(event.target.value)} />
                          <label>Notify To(use # before usernames)</label>
                          <input placeholder="dont forget to add # between usernames" onChange={(event) => setnotify(event.target.value)} />
                          <button className="submitButton" onClick={(event) => handleSubmit(event)} type="submit" >Add Pin</button>
                        </div>

                          : null}
                      </div>
                    </Popup>
                  }
                </div>
              )
            })
          )
        })}
      </>
    )
  }



  async function getLocation() {

    if (navigator.geolocation) {
      (navigator.geolocation.getCurrentPosition(showPosition))


    }


  }

  async function showPosition(position) {



    setViewport((prev) => {
      return {
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude

      }
    })
    const cuser = localStorage.getItem("token")

    const res = await axios.post(`${url}/log/location`, { username: cuser, lat: position.coords.latitude, lang: position.coords.longitude })
    setcurrentuser(res.data)

  }

  async function StartChat(event, username, id) {
    event.preventDefault()





    setmsgbox((prev) => {
      return {
        ...prev,
        [id]: true
      }
    })
  }






  function MessageSetter(m, id) {
    setmessages((prev) => {
      return {
        ...prev,
        [id]: m
      }
    })
  }


  function onClose(id) {
    setmsgbox((prev) => {
      return {
        ...prev,
        [id]: false
      }
    })



  }

  function SetProfile(event) {
    event.preventDefault()

    setprofile(event.target.files[0])


    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("pro");


    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
      imgtag.src = event.target.result;

    };

    reader.readAsDataURL(selectedFile);

  }


  function Upload(event) {

    event.preventDefault()

    var i_url;

    const uploadtask = storage.storage().ref(`images/${profile.name}`).put(profile)
    uploadtask.on(
      "state_changed",
      snapshot => { },
      error => {
        console.log(error)
      },
      () => {
        storage.storage()
          .ref("images")
          .child(profile.name)
          .getDownloadURL()
          .then(imgurl => {
            i_url = imgurl
            profilehelp()

          })
      }
    )


    async function profilehelp() {


      const r = await axios.post(`${url}/log/change`, { username: currentuser.username, c: i_url, var: "profile" })
      if (r) {
        setrp(rp + 1)
      }

    }
  }

  function userPins() {
    return (
      <>
        {userpins.map((p) => {

          return (
            <div key={p._id}>
              <Marker latitude={p.lat} longitude={p.lang} offsetLeft={-(viewport.zoom * 3.5)} offsetTop={-(viewport.zoom * 7)}>

                <LocationOnIcon style={{ fontSize: viewport.zoom * 7, color: p.username === currentuser.username ? "#005a8d" : "#f55c47", cursor: "pointer", zIndex: 10 }}
                  onClick={() => markerClick(p._id, p.lat, p.lang)}

                />
              </Marker>
              {currentplace === p._id &&
                <Popup
                  latitude={p.lat}
                  longitude={p.lang}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setcurrentplace(null)}
                  anchor="left" >
                  <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                    <label>Username</label>
                    <h4 className="place">{p.username}</h4>
                    <img id="pro" src={p.profile} className="profile_img" />
                    {currentuser.username === p.username && <div><label className="labelimage" htmlFor="p" style={{ height: "20px", marginRight: "20px", fontSize: "15px" }}>+</label>
                      <input id="p" className="setprofile" style={{ visibility: "hidden" }} type="file" onChange={(event) => SetProfile(event)} />
                      <button className="upload_btn" onClick={(event) => Upload(event)}>Upload</button></div>}
                    <label>Bio</label>
                    {currentuser.username !== p.username ?
                      <p className="desc">{p.Bio}</p>
                      :
                      <div>

                        <button onClick={() => bioedit ? setbioedit(false) : setbioedit(true)}>Edit</button>
                        {bioedit ? <div><textarea value={bio} onChange={(event) => changeBio(event)} className="bio" placeholder="Say Something about yourself" /><button onClick={(event) => Setbio(event)}>Set</button> </div> : <p className="desc">{p.Bio}</p>}
                      </div>
                    }



                    <label>Thought of the Day</label>
                    <p className="desc">{p.thoughtofday}</p>

                    {currentuser.username !== p.username && <button onClick={(event) => StartChat(event, p.username, p._id)}>Chat</button>}
                    {/* <label>Information</label> */}
                    {/* <span className="username">Created by <b>{p.username}</b></span> */}
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              }


              {msgbox[p._id] ?
                <Popup
                  className="popup"
                  latitude={p.lat}
                  longitude={p.lang}
                  closeButton={false}
                  closeOnClick={false}
                  // onClose={()=>onClose(p._id)}
                  anchor="left" >

                  <Messagebox id={p._id} CloseChat={onClose} currentuser={currentuser.username} username={p.username} messages={messages} messagesetter={MessageSetter} socket={socket} />

                </Popup>
                : null}
            </div>
          )
        })}

      </>
    )
  }

  function Logout() {
    localStorage.removeItem("token")
    setshowLogin(true)
  }



  return (
    <div className="App">
      {/* <iframe src="https://bitmoji.netlify.app/"></iframe> */}
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={"pk.eyJ1IjoiZGFya3NpZGVyNTEiLCJhIjoiY2wwZHl6NXY4MGR2NzNjbXo5ZTBtZGE4eSJ9._xuts111DHQXPl5CflCMiQ"}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/darksider51/ckpijb0qi1unb17rtosxrlaz7"
        onDblClick={(event) => Addplace(event)}

      >

        {showPins()}
        {userPins()}
        {/* {currentuser.latitude!=="" && myPin()} */}

        {currentuser.username ?
          <button className="button logout" onClick={Logout}>Logout</button>
          :
          <div className="buttons">
            <button className="button login" onClick={() => {
              setshowRegister(false)
              setshowLogin(true)
            }}>Login</button>
            <button className="button register" onClick={() => {
              setshowLogin(false)
              setshowRegister(true)
            }}>Register</button>
          </div>
        }

        {showLogin && <Login getLocation={getLocation} setshowLogin={setshowLogin} />}
        {showRegister && <Register />}
      </ReactMapGL>


    </div>
  );
}

export default App;
