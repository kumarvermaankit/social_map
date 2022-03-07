import React, { useRef, useState } from "react"
import "./register.css"
import LocationOnIcon from '@material-ui/icons/LocationOn';
import axios from "axios"

function Register() {

    const url = "https://socialmapchat.herokuapp.com/api"
    const url2 = "http://localhost:5000/api"

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const nameRef = useRef()
    const emailRef = useRef()
    const pswdRef = useRef()


    async function handleSubmit(event) {
        event.preventDefault()

        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: pswdRef.current.value
        }

        try {
            await axios.post(`${url2}/log/register`, newUser)
            setError(false)
            setSuccess(true)
        }
        catch (err) {
            setError(false)
        }

    }

    return (
        <div className="registerContainer">
            <div className="logo">
                Social Map
                <LocationOnIcon />

            </div>
            <div className="card">
                <input type="text" placeholder="Username" ref={nameRef} />
                <input type="email" placeholder="Email" ref={emailRef} />
                <input type="password" placeholder="Password" ref={pswdRef} />
                <button onClick={(event) => handleSubmit(event)} className="button register">Register</button>
            </div>
            {success && <div className="success"> Successfully registered! You now login Now</div>}
            {error && <div className="failure"> Something went wrong</div>}

        </div>
    )
}

export default Register