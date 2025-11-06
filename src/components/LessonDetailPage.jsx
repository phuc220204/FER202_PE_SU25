import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Card, Spinner, Alert, ListGroup, Button } from "react-bootstrap";

export default function LessonDetailPage() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const data = await get(`/${id}`);
        setLesson(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const formatTime = (time) => {
    return new Intl.NumberFormat().format(time);
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status" className="d-block mx-auto" />
    );
  }

  if (error) {
    return <Alert variant="danger">Error loading lesson data: {error}</Alert>;
  }

  if (!lesson) {
    return <Alert variant="warning">Lesson not found.</Alert>;
  }

  return (
    <Card className="w-75 mx-auto">
      <Card.Header as="h3">{lesson.lessonTitle}</Card.Header>
      <Card.Img
        variant="top"
        src={lesson.lessonImage}
        alt={lesson.lessonTitle}
        style={{ maxHeight: "400px", objectFit: "cover" }}
      />
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Level:</strong> {lesson.level}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Status:</strong>{" "}
            {lesson.isCompleted ? "Completed" : "Not Completed"}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Estimated Time:</strong> {formatTime(lesson.estimatedTime)}{" "}
            minutes
          </ListGroup.Item>
        </ListGroup>
        <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">
          Back to list
        </Button>
      </Card.Body>
    </Card>
  );
}
