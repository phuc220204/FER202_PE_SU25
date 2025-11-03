import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Card, Spinner, Alert, ListGroup, Button } from "react-bootstrap";

/**
 * Task 3.1 (1.0 mark): Lesson Detail Page
 * Display all the details of a lesson: lessonTitle, lessonImage, level, isCompleted, estimatedTime.
 * The estimatedTime value must be formatted with comma separators for thousands (e.g., 1,200 minutes).
 * Design and arrange this component in a visually pleasing and clear layout.
 */
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

  // Task 3.1: Format estimatedTime with comma separators for thousands
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
    // Task 3.1: Design and arrange this component in a visually pleasing and clear layout
    <Card className="w-75 mx-auto">
      {/* Task 3.1: Display lessonTitle */}
      <Card.Header as="h3">{lesson.lessonTitle}</Card.Header>
      {/* Task 3.1: Display lessonImage */}
      <Card.Img
        variant="top"
        src={lesson.lessonImage}
        alt={lesson.lessonTitle}
        style={{ maxHeight: "400px", objectFit: "cover" }}
      />
      <Card.Body>
        {/* Task 3.1: Display all details: level, isCompleted, estimatedTime */}
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
