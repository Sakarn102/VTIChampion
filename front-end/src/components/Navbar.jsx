import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="demo-nav">
      <h3 style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--blue-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Testing Navigation (Remove later)</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/login')} data-screen="login">Login</button>
        <button onClick={() => navigate('/register')} data-screen="register">Register</button>
        <button onClick={() => navigate('/verify')} data-screen="verify">Verify Email</button>
        <button onClick={() => navigate('/')} data-screen="home">Student Home</button>
        <button onClick={() => navigate('/exam-list')} data-screen="exam-list">Instructor Home</button>
        <button onClick={() => navigate('/create-exam')} data-screen="create-exam">Create Exam</button>
        {/* These require IDs, using a placeholder ID 1 for testing */}
        <button onClick={() => navigate('/exams/1')} data-screen="exam-detail">Exam Detail</button>
        <button onClick={() => navigate('/exams/edit/1')} data-screen="edit-exam">Edit Exam</button>
      </div>
    </nav>
  );
}
