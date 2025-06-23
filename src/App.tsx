import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import InstructorManagement from './components/InstructorManagement';
import ScheduleManagement from './components/ScheduleManagement';
import ScheduleCapacity from './components/ScheduleCapacity';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/instructors" element={<InstructorManagement />} />
          <Route path="/schedule" element={<ScheduleManagement />} />
          <Route path="/schedule-capacity" element={<ScheduleCapacity />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;