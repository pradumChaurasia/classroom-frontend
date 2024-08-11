import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import "./PDashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropagateLoader from "react-spinners/PropagateLoader";
import Select from 'react-select';

Modal.setAppElement('#root');

const PDashboard = () => {
    const [showClassroomModal, setShowClassroomModal] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditModalOpen2, setIsEditModalOpen2] = useState(false);

    const [currentUser, setCurrentUser] = useState({ name: '', email: '', id: '' });
    const [loading, setLoading] = useState(false);
    const [studentDelete, setStudentDelete] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [teacherDelete, setTeacherDelete] = useState(null)
    const [isDeleteModalOpen1, setIsDeleteModalOpen1] = useState(false);

    const [classroomData, setClassroomData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        days: '',
        teacher: null,
        students: []
    });

    const { token, user } = useSelector(state => state.user)
    const navigate = useNavigate();

    console.log(user)

    useEffect(() => {

        const getUsers = async () => {

            try {
                // const response = await axios.get('http://localhost:3000/api/user/getUsers')
                const response = await axios.get('https://classroom-backend-alpha.vercel.app/api/user/getUsers')
                setTeachers(response.data.teachers || [])
                setStudents(response.data.students || [])
            }
            catch (error) {
                console.log(error.message)
            }
        }
        getUsers();
    }, [loading, user])
    console.log(teachers, students)

    const handleEditUser = (user) => {
        setCurrentUser({ name: user.name, email: user.email, id: user._id });
        setIsEditModalOpen(true);
    };
    const handleEditUser2 = (user) => {
        setCurrentUser({ name: user.name, email: user.email, id: user._id });
        setIsEditModalOpen2(true);
    };

    const saveUpdatedUser = async () => {
        setLoading(true)
        try {
            // const response = await axios.put(`http://localhost:3000/api/user/updateUser/${currentUser.id}`, {
            const response = await axios.put(`https://classroom-backend-alpha.vercel.app/api/user/updateUser/${currentUser.id}`, {
                name: currentUser.name,
                email: currentUser.email
            });

            if (response.status === 200) {
                toast.success('User updated successfully');
                setIsEditModalOpen(false);
                setIsEditModalOpen2(false);
                setLoading(false)
            }
        } catch (error) {
            toast.error("Error Updating User")
            setLoading(false)
        }
    };

    const handleCreateClassroom = async () => {
        setLoading(true);
        if (classroomData.name === ""){
            setLoading(false)
            toast.error("Enter Classroom Name")
        }
        else if( classroomData.startTime === ""){
            setLoading(false)
            toast.error("Enter Classroom Start Time")
        }
        else if( classroomData.endTime === ""){
            setLoading(false)
            toast.error("Enter Classroom End Time")
        }
        else if( classroomData.days === ""){
            setLoading(false)
            toast.error("Enter Classroom Days")
        }
        else if(classroomData.teacher === null){
            setLoading(false)
            toast.error("Select Teacher")
        }
        else if(classroomData.students.length ===0){
            setLoading(false)
            toast.error("Select Students")
        }
        else{
            try {
                const { name, startTime, endTime, days, teacher, students } = classroomData;
                const principalEmail = user.email;
    
               
                // const classroomResponse = await axios.post('http://localhost:3000/api/classroom/create', {
                const classroomResponse = await axios.post('https://classroom-backend-alpha.vercel.app/api/classroom/create', {
                    name, startTime, endTime, days, principalEmail, teacherId: teacher?.value
                });
    
                const classroomId = classroomResponse.data.classroom._id;
    
                if (students.length > 0) {
                    const studentIds = students.map(student => student.value);
                    // await axios.post('http://localhost:3000/api/classroom/add-students', {
                    await axios.post('https://classroom-backend-alpha.vercel.app/api/classroom/add-students', {
                        classroomId, studentIds, requesterEmail: principalEmail
                    });
                }
    
                toast.success('Classroom created successfully');
                setShowClassroomModal(false);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message); 
                } else {
                    toast.error("An unexpected error occurred");
                }
                setLoading(false);
            }
        }
    };

    const confirmDeleteTask = (id) => {
        setStudentDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTask1 = (id) => {
        setTeacherDelete(id);
        setIsDeleteModalOpen1(true);
    };

    const handleDeleteStudent = async (id) => {
        try {
            // const response = await axios.delete(`http://localhost:3000/api/classroom/deleteStudent/${id}`);
            const response = await axios.delete(`https://classroom-backend-alpha.vercel.app/api/classroom/deleteStudent/${id}`);

            if (response.status === 200) {
                toast.success('Student Deleted Successfully');
                setStudents(students.filter(student => student._id !== id));
            }
        } catch (error) {
            toast.error("Error Deleting Student");
        }
    }

    const handleDeleteTeacher = async (id) => {
        try {
            // const response = await axios.delete(`http://localhost:3000/api/classroom/deleteTeacher/${id}`);
            const response = await axios.delete(`https://classroom-backend-alpha.vercel.app/api/classroom/deleteTeacher/${id}`);

            if (response.status === 200) {
                toast.success('Teacher Deleted Successfully');
                setTeachers(teachers.filter(teacher => teacher._id !== id));
            }
        } catch (error) {
            toast.error("Error Deleting Teacher");
        }
    }


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
                            <h2>Principal Dashboard</h2>

                            <div className='dashboard-add-classroom' style={{marginBottom:'30px'}}>

                                <button onClick={() => setShowClassroomModal(true)}>Create Classroom</button>
                                <button onClick={() => navigate("/classrooms")} style={{backgroundColor:"darkcyan"}}>See All Classroom</button>

                                <div className='Register-user'>
                                    <button onClick={() => navigate('/register-student')} style={{backgroundColor:"rgb(241 208 56)"}}>Register Student</button>
                                    <button onClick={() => navigate('/register-teacher')} style={{backgroundColor:"rgb(241 182 56)"}}>Register Teacher</button>
                                </div>
                            </div>
                            
                            <hr style={{height: '3.05px', color: "#000", width:'80%'}} />

                            <div className="row table-container">
                                <div className="col-md-6 table-responsive">
                                    <h3>Teachers</h3>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teachers.length > 0 && teachers?.map(teacher => (
                                                <tr key={teacher._id}>
                                                    <td>{teacher.name}</td>
                                                    <td>{teacher.email}</td>
                                                    <td className="text-right">
                                                        <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditUser(teacher)}>Edit</button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => confirmDeleteTask1(teacher._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="col-md-6 table-responsive">
                                    <h3>Students</h3>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.length > 0 && students?.map(student => (
                                                <tr key={student._id}>
                                                    <td>{student.name}</td>
                                                    <td>{student.email}</td>
                                                    <td className="text-right">
                                                        <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditUser2(student)}>Edit</button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => confirmDeleteTask(student._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>



                            <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)}
                                className="modal-edit"
                                overlayClassName="overlay"
                                style={{ height: '60vh' }}>
                                <h2 style={{ marginBottom: '12px' }}>Edit User</h2>
                                <div className="modal-content">
                                    <div className='modal-title'>
                                        <p>Name</p>
                                        <input
                                            type="text"
                                            value={currentUser.name}
                                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                        />
                                    </div>
                                    <div className='modal-description'>
                                        <p>Email</p>
                                        <input
                                            value={currentUser.email}
                                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-buttons">
                                    <button className='modal-button1' onClick={saveUpdatedUser}>Save</button>
                                    <button className='modal-button2' onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                </div>
                            </Modal>

                            <Modal isOpen={isEditModalOpen2} onRequestClose={() => setIsEditModalOpen2(false)}
                                className="modal-edit"
                                overlayClassName="overlay"
                                style={{ height: '60vh' }}>
                                <h2 style={{ marginBottom: '12px' }}>Edit User</h2>
                                <div className="modal-content">
                                    <div className='modal-title'>
                                        <p>Name</p>
                                        <input
                                            type="text"
                                            value={currentUser.name}
                                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                        />
                                    </div>
                                    <div className='modal-description'>
                                        <p>Email</p>
                                        <input
                                            value={currentUser.email}
                                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-buttons">
                                    <button className='modal-button1' onClick={saveUpdatedUser}>Save</button>
                                    <button className='modal-button2' onClick={() => setIsEditModalOpen2(false)}>Cancel</button>
                                </div>
                            </Modal>

                            <Modal
                                isOpen={showClassroomModal}
                                onRequestClose={() => setShowClassroomModal(false)}
                                className="modal-edit"
                                overlayClassName="overlay"
                            >
                                <h2>Create Classroom</h2>
                                <div className="modal-content">
                                    <div>
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={classroomData.name}
                                            onChange={(e) => setClassroomData({ ...classroomData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Start Time</label>
                                        <input
                                            type="text"
                                            value={classroomData.startTime}
                                            onChange={(e) => setClassroomData({ ...classroomData, startTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>End Time</label>
                                        <input
                                            type="text"
                                            value={classroomData.endTime}
                                            onChange={(e) => setClassroomData({ ...classroomData, endTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Days</label>
                                        <input
                                            type="text"
                                            value={classroomData.days}
                                            onChange={(e) => setClassroomData({ ...classroomData, days: e.target.value })}
                                        />
                                    </div>
                                    <div style={{marginTop:'8px'}}>
                                        <label>Assign Teacher</label>
                                        <Select
                                            options={teachers.map(teacher => ({ value: teacher._id, label: teacher.name }))}
                                            onChange={(selected) => setClassroomData({ ...classroomData, teacher: selected })}
                                        />
                                    </div>
                                    <div style={{marginTop:'8px'}}>
                                        <label>Assign Students</label>
                                        <Select
                                            options={students.map(student => ({ value: student._id, label: student.name }))}
                                            isMulti
                                            onChange={(selected) => setClassroomData({ ...classroomData, students: selected })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-buttons">
                                    <button className='modal-button1' onClick={handleCreateClassroom}>Save</button>
                                    <button className='modal-button2' onClick={() => setShowClassroomModal(false)}>Cancel</button>
                                </div>
                            </Modal>


                            <Modal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} className="modal-delete" overlayClassName="overlay" style={{ height: '30vh' }}>
                                <h2 style={{ marginBottom: '12px' }}>Confirm Delete</h2>
                                <div className="modal-content">
                                    <p>Are you sure you want to delete this Student?</p>
                                </div>
                                <div className="modal-buttons">
                                    <button className='modal-button11' onClick={() => {
                                        handleDeleteStudent(studentDelete);
                                        setIsDeleteModalOpen(false);
                                    }}>Yes</button>
                                    <button className='modal-button22' onClick={() => setIsDeleteModalOpen(false)}>No</button>
                                </div>
                            </Modal>

                            <Modal isOpen={isDeleteModalOpen1} onRequestClose={() => setIsDeleteModalOpen1(false)} className="modal-delete" overlayClassName="overlay" style={{ height: '30vh' }}>
                                <h2 style={{ marginBottom: '12px' }}>Confirm Delete</h2>
                                <div className="modal-content">
                                    <p>Are you sure you want to delete this Teacher?</p>
                                </div>
                                <div className="modal-buttons">
                                    <button className='modal-button11' onClick={() => {
                                        handleDeleteTeacher(teacherDelete);
                                        setIsDeleteModalOpen1(false);
                                    }}>Yes</button>
                                    <button className='modal-button22' onClick={() => setIsDeleteModalOpen1(false)}>No</button>
                                </div>
                            </Modal>
                        </div>

                    </>
                )
            }
            <ToastContainer />
        </>
    );
}

export default PDashboard