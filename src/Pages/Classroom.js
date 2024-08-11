import React, { useEffect, useState } from 'react'
import './PDashboard.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";
import Modal from 'react-modal';


const Classroom = () => {
    const [classrooms, setClassrooms] = useState([]);
    const navigate = useNavigate()
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);


    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                // const response = await axios.get('http://localhost:3000/api/classroom/getAllClassrooms');
                const response = await axios.get('https://classroom-backend-alpha.vercel.app/api/classroom/getAllClassrooms');
                setClassrooms(response.data.classrooms);
            } catch (error) {
                console.error('Error fetching classrooms:', error);
            }
        };

        fetchClassrooms();
    }, []);

    const goBack = () => {
        window.history.back();
    };



    const openModal = async (studentId) => {
        try {
            // const response = await axios.get(`http://localhost:3000/api/classroom/getStudentDetails/${studentId}`);
            const response = await axios.get(`https://classroom-backend-alpha.vercel.app/api/classroom/getStudentDetails/${studentId}`);
            setSelectedStudent(response.data);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedStudent(null);
    };
    console.log(classrooms)
    return (
        <div>
            <p onClick={goBack} className="back-button"><IoArrowBackSharp style={{ marginRight: "8px", fontSize: "17px" }} />Back</p>
            <div className="principal-container">

                <h2>Classrooms</h2>
                <div className="classrooms-grid">
                    {classrooms.map((classroom) => (
                        <div key={classroom._id} className="classroom-box">
                            
                            <h3>{classroom.name}</h3>
                            
                            <h4>Teacher: {classroom.teacher ? classroom.teacher.name : 'Not assigned'}</h4>
                            <ul>
                                {classroom.students.length > 0 ? (
                                    classroom.students.map((student) => (
                                        <li
                                            key={student._id}
                                            onClick={() => openModal(student._id)}
                                            className="student-name"
                                        >
                                            {student.name}
                                        </li>
                                    ))
                                ) : (
                                    <li>No students assigned</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            {selectedStudent && (
                <Modal
                    isOpen={modalIsOpen} onRequestClose={closeModal}
                    className="student-modal"
                    overlayClassName="overlay"
                >
                    <h2>{selectedStudent.student.name}</h2>
                    <p><b>Email:</b> {selectedStudent.student.email}</p>
                    <p><b>Phone Number:</b> {selectedStudent.student.phoneNumber}</p>
                    <p><b>Roll Number:</b> {selectedStudent.student.rollNumber}</p>
                    <h4>Enrolled Classrooms:</h4>
                    <ul>
                        {selectedStudent.classrooms.map((classroom) => (
                            <li key={classroom._id}>{classroom.name}</li>
                        ))}
                    </ul>
                    <button onClick={closeModal} className="close-button">Close</button>
                </Modal>
            )}
        </div>
    )
}

export default Classroom
