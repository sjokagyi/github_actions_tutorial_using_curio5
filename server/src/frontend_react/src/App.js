import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SignUpStep1 from './pages/SignUpStep1';
import SignUpStep2 from './pages/SignUpStep2';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateSchool from './pages/CreateSchool';
import ProtectedRoute from './utils/ProtectedRoute';
import { logout } from './utils/auth';

function App() {
  const [userDetails, setUserDetails] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const storedUserType = localStorage.getItem('user_type');
    setIsAuthenticated(!!accessToken && !!refreshToken);
    setUserType(storedUserType);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserType('');
  };

  const handleLogin = (userType) => {
    setIsAuthenticated(true);
    setUserType(userType);
  };

  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Curio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  {(userType === 'school_admin' || userType === 'curio_admin') && (
                    <Nav.Link as={Link} to="/create-school">Create School</Nav.Link>
                  )}
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUpStep1 setUserDetails={setUserDetails} />} />
          <Route path="/signup-step2" element={<SignUpStep2 userDetails={userDetails} />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/create-school" element={
            <ProtectedRoute userType={userType} requiredUserType="school_admin">
              <CreateSchool />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
