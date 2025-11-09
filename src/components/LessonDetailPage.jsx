import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Card, Spinner, Alert, Button } from "react-bootstrap";

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
    <Card className="mx-auto" style={{ maxWidth: "900px", width: "100%" }}>
      <Card.Img
        variant="top"
        src={lesson.lessonImage}
        alt={lesson.lessonTitle}
        style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
      />
      <Card.Body>
        <Card.Title>{lesson.lessonTitle}</Card.Title>
        <Card.Text>
          <strong>Level:</strong> {lesson.level}
          <br />
          <strong>Status:</strong>{" "}
          {lesson.isCompleted ? "Completed" : "Not Completed"}
          <br />
          <strong>Estimated Time:</strong> {formatTime(lesson.estimatedTime)}{" "}
          minutes
        </Card.Text>
        <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">
          Back to list
        </Button>
      </Card.Body>
    </Card>
  );
}
