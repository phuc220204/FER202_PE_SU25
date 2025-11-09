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

export default function AllLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await get("/");
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

  const handleItemClick = (id) => {
    navigate(`/se181834/lessons/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/se181834/edit-lesson/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (isConfirmed) {
      try {
        await remove(`/${id}`);
        setToastMessage("Lesson deleted successfully!");
        setToastVariant("success");
        setShowToast(true);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Lessons</h2>
        <Button variant="success" onClick={() => navigate("/se181834/add-lesson")}>
          + Add New Lesson
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Lesson Title</th>
            <th>Level</th>
            <th>Estimated Time (min)</th>
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
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={(e) => handleEdit(e, lesson.id)}
                  >
                    Edit
                  </Button>
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
