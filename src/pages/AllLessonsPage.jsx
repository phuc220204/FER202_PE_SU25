import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get, remove } from "../api/apiCaller";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";

/**
 * Task 2.3 (1.0 mark): All Lessons Page
 * Display the full list of lessons in a list layout.
 * Each item must show: lessonTitle, level, and estimatedTime.
 * Each row must include links or icons for Edit and Delete actions.
 * The list must be automatically sorted in descending order by the id field.
 * Clicking a lesson item should navigate to the Lesson Detail page.
 */
export default function AllLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State cho Toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const navigate = useNavigate();

  // Hàm lấy danh sách lessons từ API
  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await get("/");

      // Task 2.3: The list must be automatically sorted in descending order by the id field
      const sortedData = data.sort((a, b) => parseInt(b.id) - parseInt(a.id));

      setLessons(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Task 2.3: Clicking a lesson item should navigate to the Lesson Detail page
  const handleItemClick = (id) => {
    navigate(`/SE181834/lessons/${id}`);
  };

  /**
   * Task 3.4 (1.25 marks): Update a Lesson function
   * Clicking the Edit button must navigate to the update form.
   * The form must follow the same validation rules as the Add Lesson form in Task 3.2.
   */
  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/SE181834/edit-lesson/${id}`);
  };

  /**
   * Task 3.3 (0.75 mark): Delete function
   * You must show a confirmation prompt before deleting.
   * After successful deletion, show a notification (modal, alert, toast, etc.).
   * Reload the lesson list.
   */
  const handleDelete = async (e, id) => {
    e.stopPropagation();

    // Task 3.3: Show a confirmation prompt before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (isConfirmed) {
      try {
        await remove(`/${id}`);

        // Task 3.3: After successful deletion, show a notification
        setToastMessage("Lesson deleted successfully!");
        setToastVariant("success");
        setShowToast(true);

        // Task 3.3: Reload the lesson list
        fetchLessons();
      } catch (err) {
        setToastMessage(`Error deleting lesson: ${err.message}`);
        setToastVariant("danger");
        setShowToast(true);
      }
    }
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status" className="d-block mx-auto" />
    );
  }

  if (error) {
    return <Alert variant="danger">Error loading data: {error}</Alert>;
  }

  return (
    <div>
      {/* Header với nút thêm lesson mới */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Lessons</h2>
        <Button variant="success" onClick={() => navigate("/add-lesson")}>
          + Add New Lesson
        </Button>
      </div>

      {/* Task 2.3: Display the full list of lessons in a list layout */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            {/* Task 2.3: Each item must show: lessonTitle, level, and estimatedTime */}
            <th>Lesson Title</th>
            <th>Level</th>
            <th>Estimated Time (min)</th>
            {/* Task 2.3: Each row must include links or icons for Edit and Delete actions */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <tr
                key={lesson.id}
                onClick={() => handleItemClick(lesson.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{lesson.id}</td>
                <td>{lesson.lessonTitle}</td>
                <td>{lesson.level}</td>
                <td>{lesson.estimatedTime}</td>
                <td>
                  {/* Task 3.4: Edit button */}
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={(e) => handleEdit(e, lesson.id)}
                  >
                    Edit
                  </Button>
                  {/* Task 3.3: Delete button */}
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={(e) => handleDelete(e, lesson.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No lessons found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Task 3.3: After successful deletion, show a notification (Toast) */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "success" ? "text-white" : "text-white"}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
