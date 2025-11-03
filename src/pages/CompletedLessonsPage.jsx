import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Table, Spinner, Alert, Image } from "react-bootstrap";

/**
 * Task 2.4 (1.0 mark): Completed Lessons Page
 * Display all lessons that are completed (isCompleted == true) in a list layout.
 * Each item must show: lessonTitle, level, and lessonImage.
 * Sort the lessons automatically in descending order by id.
 * Clicking a lesson item should navigate to the Lesson Detail page.
 */
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

        // Task 2.4: Display all lessons that are completed (isCompleted == true)
        const completed = data.filter((lesson) => lesson.isCompleted);

        // Task 2.4: Sort the lessons automatically in descending order by id
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

  // Task 2.4: Clicking a lesson item should navigate to the Lesson Detail page
  const handleItemClick = (id) => {
    navigate(`/SE181834/lessons/${id}`);
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
      {/* Task 2.4: Display in a list layout */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {/* Task 2.4: Each item must show: lessonTitle, level, and lessonImage */}
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
