import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Thêm 'remove' từ apiCaller
import { get, remove } from "../api/apiCaller";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

export default function AllLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Hàm fetch data, sẽ được gọi lại khi xoá
  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await get("/"); // Gọi API

      // Task 2.3: Sắp xếp giảm dần theo ID
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

  // Task 2.3: Điều hướng khi click vào hàng
  const handleItemClick = (id) => {
    navigate(`/SE181834/lessons/${id}`);
  };

  // Task 3.4: Hoàn thiện hàm Edit
  const handleEdit = (e, id) => {
    e.stopPropagation(); // Ngăn việc click vào hàng
    // Điều hướng đến trang edit với ID
    navigate(`/SE181834/edit-lesson/${id}`);
  };

  // Task 3.3: Hoàn thiện hàm Delete
  const handleDelete = async (e, id) => {
    e.stopPropagation(); 

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (isConfirmed) {
      try {
        await remove(`/${id}`); // Gọi API để xoá

        // Task 3.3: Hiển thị notification (dùng alert)
        alert("Lesson deleted successfully!");

        // Task 3.3: Tải lại danh sách
        fetchLessons();
      } catch (err) {
        alert(`Error deleting lesson: ${err.message}`);
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
      <h2 className="mb-4">All Lessons</h2>
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
                onClick={() => handleItemClick(lesson.id)} // Task 2.3
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
    </div>
  );
}
