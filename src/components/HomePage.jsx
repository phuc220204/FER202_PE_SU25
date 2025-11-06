import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";

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
        setLessons(data.filter((lesson) => !lesson.isCompleted));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

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
        <Row xs={1} md={2} lg={3} className="g-4">
          {lessons.map((lesson) => (
            <Col key={lesson.id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={lesson.lessonImage}
                  onClick={() => handleImageClick(lesson.id)}
                  style={{ cursor: "pointer" }}
                />
                <Card.Body>
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
