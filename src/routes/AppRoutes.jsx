import MainLayout from "../layouts/MainLayout";
import HomePage from "../components/HomePage";
import AllLessonsPage from "../components/AllLessonsPage";
import CompletedLessonsPage from "../components/CompletedLessonsPage";
import LessonDetailPage from "../components/LessonDetailPage";
import AddLessonPage from "../components/AddLessonPage";

const routes = () => [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/se181834/all-lessons",
        element: <AllLessonsPage />,
      },
      {
        path: "/se181834/completed-lessons",
        element: <CompletedLessonsPage />,
      },
      {
        path: "/se181834/lessons/:id",
        element: <LessonDetailPage />,
      },
      {
        path: "/se181834/add-lesson",
        element: <AddLessonPage />,
      },
      {
        path: "/se181834/edit-lesson/:id",
        element: <AddLessonPage />,
      },
    ],
  },
];

export default routes;
