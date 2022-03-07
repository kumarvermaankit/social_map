import React, { useRef, useState } from "react"
import axios from "axios"
import LocationOnIcon from '@material-ui/icons/LocationOn';
import "./login.css"


function Login(props) {

    const url = "http://localhost:5000/api"
    const url2 = "http://localhost:5000/api"
    const nameRef = useRef()
    const pswdRef = useRef()

    async function handleSubmit(event) {
        event.preventDefault()

        const u = {
            username: nameRef.current.value,
            password: pswdRef.current.value
        }

        try {
            const res = await axios.post(`${url}/log/login`, u)
            localStorage.setItem("token", u.username)
            props.setshowLogin(false)
            await props.getLocation(u.username)

        }
        catch (err) {
            console.log(err)
        }

    }



    return (
        <div className="registerContainer" style={{ height: "210px" }}>
            <div className="logo">
                Social Map
                <LocationOnIcon />

            </div>
            <div className="card">
                <input type="text" placeholder="Username" ref={nameRef} />

                <input type="password" placeholder="Password" ref={pswdRef} />
                <button onClick={(event) => handleSubmit(event)} className="button register">Login</button>
            </div>


        </div>
    )
}

export default Login