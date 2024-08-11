import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PSignin from './Pages/PSignin';
import SSignin from './Pages/SSignin';
import TSignin from './Pages/TSignin';
import PDashboard from './Pages/PDashboard';
import SRegister from './Pages/SRegister';
import TRegister from './Pages/TRegister';
import Classroom from './Pages/Classroom';
import TDashboard from './Pages/TDashboard';
import SDashboard from './Pages/SDashboard';
import Dashboard from './Pages/Dashboard';


function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/principal-signin" element={<PSignin />} />
          <Route exact path="/student-signin" element={<SSignin />} />
          <Route exact path="/teacher-signin" element={<TSignin />} />
          <Route exact path="/pdashboard" element={<PDashboard />} />
          <Route exact path="/tdashboard" element={<TDashboard />} />
          <Route exact path="/sdashboard" element={<SDashboard />} />
          <Route exact path="/register-student" element={<SRegister />} />
          <Route exact path="/register-teacher" element={<TRegister />} />
          <Route exact path="/classrooms" element={<Classroom />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
