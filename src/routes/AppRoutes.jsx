import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import AllLessonsPage from '../pages/AllLessonsPage';
import CompletedLessonsPage from '../pages/CompletedLessonsPage';
import LessonDetailPage from '../pages/LessonDetailPage';
import AddLessonPage from '../pages/AddLessonPage';

const routes = () => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/SE181834/all-lessons',
        element: <AllLessonsPage />,
      },
      {
        path: '/SE181834/completed-lessons',
        element: <CompletedLessonsPage />,
      },
      {
        // Task 3.1: Route cho trang Detail
        path: '/SE181834/lessons/:id',
        element: <LessonDetailPage />,
      },
      {
        // Task 3.2: Route cho trang Add Lesson
        path: '/add-lesson',
        element: <AddLessonPage />,
      },
      {
        // Task 3.4: Route cho trang Edit Lesson
        // Dùng chung component AddLessonPage
        path: '/SE181834/edit-lesson/:id',
        element: <AddLessonPage />,
      },
    ],
  },
];

export default routes;

