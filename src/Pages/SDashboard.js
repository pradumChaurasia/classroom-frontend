import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import "./PDashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropagateLoader from "react-spinners/PropagateLoader";

const SDashboard = () => {
  const [loading, setLoading] = useState(false);
  const { token, user } = useSelector(state => state.user)
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        // const response = await axios.get(`http://localhost:3000/api/classroom/getStudentInvolveClassroom/${user._id}`);
        const response = await axios.get(`https://classroom-backend-alpha.vercel.app/api/classroom/getStudentInvolveClassroom/${user._id}`);
        setClassrooms(response.data.classrooms);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error fetching classrooms");
        }
      }
    };

    fetchClassrooms();
  }, [user._id]);

  console.log(classrooms, "class")
  return (
    <>
      {
        loading ? (<>

          <div className="" style={{ textAlign: 'center', paddingBottom: "220px" }}>
            <p style={{ color: "#4B92C8", fontWeight: "500", fontSize: "20px", marginLeft: '43px', marginBottom: "5px", marginTop: "220px" }}>Loading..</p>
            <PropagateLoader
              color={'#4B92C8'}
              loading={true}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
              style={{ marginLeft: "27px" }}
            />
          </div>


        </>) : (

          <>
            <div className="principal-container">
              <h2>Student Dashboard</h2>

              {classrooms.length > 0 ? (
                classrooms.map(classroom => (
                  <div key={classroom._id} className="classroom-card">
                    <div className="classroom-name">
                      <span className='nametest'>Classroom:</span> {classroom.name}<br />
                      <span className='nametest'>Time:</span> {classroom.startTime} - {classroom.endTime}<br />
                      <span className='nametest'>Days:</span> {classroom.days.join(', ')}
                      <hr />
                    </div>

                    <div className="teacher-section">

                      <img src="/teacher.webp" alt="teacher" />
                      <div className="teacher-name">
                        {classroom.teacher ? classroom.teacher.name : "No teacher assigned"}
                      </div>
                    </div>
                    <div className="students-section">
                      <h4>Students:</h4>
                      <div className="students-grid">
                        {classroom.students.map(student => (
                          <div key={student._id} className="student">

                            <img src="student.webp" alt={student.name} />

                            <div
                              className="student-name"
                              style={student._id === user._id ? { color: '#4B92C8', fontWeight: 'bold' } : {}}
                            >
                              {student.name}
                              {student._id === user._id && (
                                <span style={{ color: '#4B92C8', fontWeight: 'bold' }}> (You)</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No classrooms found</p>
              )}
            </div>
          </>
        )
      }
      <ToastContainer />
    </>
  )
}

export default SDashboard