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

const TDashboard = () => {
  const [students, setStudents] = useState([]);
  const [classroom, setClassroom] = useState([])
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', id: '', phoneNumber: '', rollNumber: '' });
  const { token, user } = useSelector(state => state.user)
  const navigate = useNavigate();
  const [studentDelete, setStudentDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  console.log(user, "uer")
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // const response = await axios.get(`http://localhost:3000/api/classroom/getTeacherClassroom/${user._id}`);
        const response = await axios.get(`https://classroom-backend-alpha.vercel.app/api/classroom/getTeacherClassroom/${user._id}`);
        if (response.data.message) {
          toast.info(response.data.message);

        } else {
          setStudents(response.data.students);
          setClassroom(response.data.classrooms);

        }
      } catch (error) {
        toast.error("Error fetching student data");

      }
    };

    fetchStudents();
  }, [user._id, loading]);
  const handleEditUser = (user) => {
    setCurrentUser({ name: user.name, email: user.email, id: user._id, phoneNumber: user.phoneNumber, rollNumber: user.rollNumber });
    setIsEditModalOpen(true);
  };

  const saveUpdatedUser = async () => {
    setLoading(true)
    try {
      // const response = await axios.put(`http://localhost:3000/api/user/updateUser/${currentUser.id}`, {
      const response = await axios.put(`https://classroom-backend-alpha.vercel.app/api/user/updateUser/${currentUser.id}`, {
        name: currentUser.name,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        rollNumber: currentUser.rollNumber
      });

      if (response.status === 200) {
        toast.success('User updated successfully');
        setIsEditModalOpen(false);
        setLoading(false)
      }
    } catch (error) {
      toast.error("Error Updating User")
      setLoading(false)
    }
  };

  const confirmDeleteTask = (id) => {
    setStudentDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      // const response = await axios.delete(`http://localhost:3000/api/classroom/deleteStudent/${id}`);
      const response = await axios.delete(`https://classroom-backend-alpha.vercel.app/api/classroom/deleteStudent/${id}`);

      if (response.status === 200) {
        toast.success('Student deleted successfully');
        setStudents(students.filter(student => student._id !== id));
      }
    } catch (error) {
      toast.error("Error deleting student");
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
              <h2>Teacher Dashboard</h2>
              <div className='Register-user' style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate('/register-student')}>Register Student</button>
              </div>
              <h3 className="">Classroom name: <span className='classroom-name2'>{classroom.map((cls) => cls.name)}</span></h3>



              {
                students.length > 0 ? (
                  <div className="col-md-6 table-responsive">
                    <h3>Students</h3>
                    <table className="table table-striped table-container">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Roll Number</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.phoneNumber}</td>
                            <td>{student.rollNumber}</td>
                            <td className="text-right">
                              <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditUser(student)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => confirmDeleteTask(student._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-classroom">
                    <p>No classroom has been assigned to you.</p>
                  </div>
                )
              }
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
                <div className='modal-title'>
                  <p>Phone Number</p>
                  <input
                    type="text"
                    value={currentUser.phoneNumber}
                    onChange={(e) => setCurrentUser({ ...currentUser, phoneNumber: e.target.value })}
                  />
                </div>
                <div className='modal-title'>
                  <p>Roll Number</p>
                  <input
                    type="text"
                    value={currentUser.rollNumber}
                    onChange={(e) => setCurrentUser({ ...currentUser, rollNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-buttons">
                <button className='modal-button1' onClick={saveUpdatedUser}>Save</button>
                <button className='modal-button2' onClick={() => setIsEditModalOpen(false)}>Cancel</button>
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
          </>
        )
      }
      <ToastContainer />
    </>
  );
}

export default TDashboard