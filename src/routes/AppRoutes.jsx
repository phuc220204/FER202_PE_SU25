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
        path: "/SE181834/all-lessons",
        element: <AllLessonsPage />,
      },
      {
        path: "/SE181834/completed-lessons",
        element: <CompletedLessonsPage />,
      },
      {
        path: "/SE181834/lessons/:id",
        element: <LessonDetailPage />,
      },
      {
        path: "/add-lesson",
        element: <AddLessonPage />,
      },
      {
        path: "/SE181834/edit-lesson/:id",
        element: <AddLessonPage />,
      },
    ],
  },
];

export default routes;
