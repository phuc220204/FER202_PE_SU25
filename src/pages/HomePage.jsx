import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";

/**
 * Task 2.2 (2.0 marks): Home Page
 * Display all lessons that are not completed (isCompleted == false).
 * Show them in a grid layout.
 * Each lesson card must contain: lessonTitle, lessonImage, level, and estimatedTime (in minutes).
 * When clicking on the lesson image, the view should navigate to the Lesson Detail page.
 */
export default function HomePage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await get("/");
        // Task 2.2: Display all lessons that are not completed (isCompleted == false)
        setLessons(data.filter((lesson) => !lesson.isCompleted));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Task 2.2: When clicking on the lesson image, the view should navigate to the Lesson Detail page
  const handleImageClick = (id) => {
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
      <h2 className="mb-4">Uncompleted Lessons</h2>
      {lessons.length > 0 ? (
        // Task 2.2: Show them in a grid layout
        <Row xs={1} md={2} lg={3} className="g-4">
          {lessons.map((lesson) => (
            <Col key={lesson.id}>
              <Card className="h-100">
                {/* Task 2.2: lessonImage - clicking on image navigates to detail page */}
                <Card.Img
                  variant="top"
                  src={lesson.lessonImage}
                  onClick={() => handleImageClick(lesson.id)}
                  style={{ cursor: "pointer" }}
                />
                <Card.Body>
                  {/* Task 2.2: Each card must contain: lessonTitle, level, and estimatedTime */}
                  <Card.Title>{lesson.lessonTitle}</Card.Title>
                  <Card.Text>
                    <strong>Level:</strong> {lesson.level}
                    <br />
                    <strong>Time:</strong> {lesson.estimatedTime} minutes
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No uncompleted lessons found.</p>
      )}
    </div>
  );
}
