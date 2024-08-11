import React from 'react'
import "./Dashboard.css";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate()
  return (
    <div className="container">
      <h1 className="heading">Welcome to the Classroom!</h1>
      <p className="subText">
        To explore the classroom, please log in with your role:
      </p>
      <div className="buttonContainer">
        <button className="button" onClick={()=>navigate("/student-signin")}>Login as Student</button>
        <button className="button" onClick={()=>navigate("/teacher-signin")}>Login as Teacher</button>
        <button className="button" onClick={()=>navigate("/principal-signin")}>Login as Principal</button>
      </div>
    </div>
  )
}

export default Dashboard