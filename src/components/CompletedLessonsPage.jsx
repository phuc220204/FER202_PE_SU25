import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Table, Spinner, Alert, Image } from "react-bootstrap";

export default function CompletedLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await get("/");
        const completed = data.filter((lesson) => lesson.isCompleted);
        const sortedData = completed.sort(
          (a, b) => parseInt(b.id) - parseInt(a.id)
        );
        setLessons(sortedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/se181834/lessons/${id}`);
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
      <h2 className="mb-4">Completed Lessons</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Lesson Title</th>
            <th>Level</th>
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
                <td>
                  <Image
                    src={lesson.lessonImage}
                    alt={lesson.lessonTitle}
                    thumbnail
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>{lesson.lessonTitle}</td>
                <td>{lesson.level}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No completed lessons found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
