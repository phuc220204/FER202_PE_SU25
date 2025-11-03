import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form, Button, Spinner, Alert, FormCheck } from "react-bootstrap";
import { get, post, put } from "../api/apiCaller";

/**
 * Task 3.2 (1.5 marks): Add Lesson / Edit Lesson Form
 * The form must validate all inputs:
 * ✓ All fields are required.
 * ✓ lessonTitle must contain more than 1 word (e.g., "Kanji Master").
 * ✓ lessonImage must be a valid URL.
 * ✓ estimatedTime must be a number.
 * ✓ isCompleted is a switch control, set to false by default.
 * ✓ level is a select box with these 5 options: N1, N2, N3, N4, N5.
 *
 * Task 3.4 (1.25 marks): Update form must follow the same validation rules.
 */
const validationSchema = Yup.object().shape({
  // Task 3.2: All fields are required. lessonTitle must contain more than 1 word
  lessonTitle: Yup.string()
    .trim()
    .matches(/(\s)/, "Must contain more than 1 word")
    .required("Lesson Title is required"),

  // Task 3.2: lessonImage must be a valid URL
  lessonImage: Yup.string()
    .url("Must be a valid URL")
    .required("Lesson Image is required"),

  // Task 3.2: level is required
  level: Yup.string().required("Level is required"),

  // Task 3.2: estimatedTime must be a number
  estimatedTime: Yup.number()
    .typeError("Must be a number")
    .required("Estimated Time is required"),

  // Task 3.2: isCompleted is a switch control
  isCompleted: Yup.boolean(),
});

export default function AddLessonPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Task 3.2: Set default values, isCompleted is set to false by default
  const [initialValues, setInitialValues] = useState({
    lessonTitle: "",
    lessonImage: "",
    level: "N5",
    estimatedTime: "",
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Task 3.4: Load dữ liệu cũ khi ở chế độ Edit
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      get(`/${id}`)
        .then((data) => {
          setInitialValues(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  // Xử lý submit form cho cả Add và Edit
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        // Task 3.4: Update lesson
        await put(`/${id}`, values);
        alert("Lesson updated successfully!");
      } else {
        // Task 3.2: Add new lesson
        await post("/", values);
        alert("Lesson added successfully!");
      }

      navigate("/SE181834/all-lessons");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status" className="d-block mx-auto" />
    );
  }

  return (
    <div className="w-75 mx-auto">
      <h2 className="mb-4">{isEditMode ? "Edit Lesson" : "Add New Lesson"}</h2>

      {/* Task 3.2: The form must validate all inputs */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <FormikForm>
            {/* Task 3.2: lessonTitle field */}
            <Form.Group className="mb-3" controlId="lessonTitle">
              <Form.Label>Lesson Title</Form.Label>
              <Field type="text" name="lessonTitle" as={Form.Control} />
              <ErrorMessage
                name="lessonTitle"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

            {/* Task 3.2: lessonImage field */}
            <Form.Group className="mb-3" controlId="lessonImage">
              <Form.Label>Lesson Image URL</Form.Label>
              <Field type="text" name="lessonImage" as={Form.Control} />
              <ErrorMessage
                name="lessonImage"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

            {/* Task 3.2: level is a select box with 5 options: N1, N2, N3, N4, N5 */}
            <Form.Group className="mb-3" controlId="level">
              <Form.Label>Level</Form.Label>
              <Field as={Form.Select} name="level">
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </Field>
              <ErrorMessage
                name="level"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

            {/* Task 3.2: estimatedTime field */}
            <Form.Group className="mb-3" controlId="estimatedTime">
              <Form.Label>Estimated Time (minutes)</Form.Label>
              <Field type="text" name="estimatedTime" as={Form.Control} />
              <ErrorMessage
                name="estimatedTime"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

            {/* Task 3.2: isCompleted is a switch control */}
            <Form.Group className="mb-3" controlId="isCompleted">
              <Field
                as={FormCheck}
                type="switch"
                name="isCompleted"
                label="Is Completed?"
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner as="span" size="sm" />
              ) : isEditMode ? (
                "Update Lesson"
              ) : (
                "Add Lesson"
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="ms-2"
            >
              Cancel
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
