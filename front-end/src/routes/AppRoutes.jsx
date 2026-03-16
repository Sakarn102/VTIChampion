import { createBrowserRouter } from 'react-router-dom';
import LayoutRoot from '../layout/LayoutRoot';
import Login from '../pages/Shared/Login';
import Register from '../pages/Shared/Register';
import Verify from '../pages/Shared/Verify';
import Home from '../pages/Shared/Home';
import ExamList from '../pages/Instructor/ExamList';
import CreateExam from '../pages/Instructor/CreateExam';
import ExamDetail from '../pages/Instructor/ExamDetail';
import EditExam from '../pages/Instructor/EditExam';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutRoot />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "exam-list",
        element: <ExamList />,
      },
      {
        path: "create-exam",
        element: <CreateExam />,
      },
      {
        path: "exams/:examId",
        element: <ExamDetail />,
      },
      {
        path: "exams/edit/:examId",
        element: <EditExam />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
]);

export default router;
