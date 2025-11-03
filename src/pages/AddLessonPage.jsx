import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Form,
  Button,
  Spinner,
  Alert,
  FormCheck,
  Toast,
  ToastContainer,
  Image,
} from "react-bootstrap";
import { get, post, put } from "../api/apiCaller";

// Task 3.2: Validation Schema using Yup
// The form must validate all inputs
const validationSchema = Yup.object().shape({
  // Task 3.2: lessonTitle must contain more than 1 word (e.g., "Kanji Master")
  // All fields are required
  lessonTitle: Yup.string()
    .trim()
    .matches(/\S+\s+\S+/, "Must contain more than 1 word")
    .required("Lesson Title is required"),

  // Task 3.2: lessonImage must be a valid URL
  // All fields are required
  lessonImage: Yup.string()
    .url("Must be a valid URL")
    .required("Lesson Image is required"),

  // Task 3.2: level is a select box with 5 options: N1, N2, N3, N4, N5
  // All fields are required
  level: Yup.string().required("Level is required"),

  // Task 3.2: estimatedTime must be a number
  // All fields are required
  // Additional validation: must be a positive number
  estimatedTime: Yup.number()
    .typeError("Must be a number")
    .positive("Must be a positive number")
    .required("Estimated Time is required"),

  // Task 3.2: isCompleted is a switch control, set to false by default
  isCompleted: Yup.boolean(),
});

export default function AddLessonPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  // Task 3.4: Determine if this is Edit mode (has id) or Add mode
  const isEditMode = Boolean(id);

  // Task 3.2: Initial form values with isCompleted set to false by default
  const [initialValues, setInitialValues] = useState({
    lessonTitle: "",
    lessonImage: "",
    level: "N5",
    estimatedTime: "",
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Task 3.4: Load existing lesson data when in Edit mode
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await put(`/${id}`, values);
        setToastMessage("Lesson updated successfully!");
      } else {
        await post("/", values);
        setToastMessage("Lesson added successfully!");
      }

      setToastVariant("success");
      setShowToast(true);

      // Đợi 1.5 giây để hiển thị toast rồi navigate
      setTimeout(() => {
        navigate("/SE181834/all-lessons");
      }, 1500);
    } catch (err) {
      setError(err.message);
      setToastMessage("Error: " + err.message);
      setToastVariant("danger");
      setShowToast(true);
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

      {/* Toast Notification */}
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
            className={toastVariant === "success" ? "text-white" : ""}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Task 3.2 & 3.4: Add/Edit Lesson Form with validation */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <FormikForm>
            {/* Task 3.2: lessonTitle field - required, more than 1 word */}
            <Form.Group className="mb-3" controlId="lessonTitle">
              <Form.Label>Lesson Title</Form.Label>
              <Field type="text" name="lessonTitle" as={Form.Control} />
              <ErrorMessage
                name="lessonTitle"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

            {/* Task 3.2: lessonImage field - required, valid URL */}
            <Form.Group className="mb-3" controlId="lessonImage">
              <Form.Label>Lesson Image URL</Form.Label>
              <Field type="text" name="lessonImage" as={Form.Control} />
              <ErrorMessage
                name="lessonImage"
                component={Form.Text}
                className="text-danger"
              />
              {/* Image Preview - additional feature for better UX */}
              {values.lessonImage && (
                <div className="mt-2">
                  <Form.Text className="text-muted">Preview:</Form.Text>
                  <Image
                    src={values.lessonImage}
                    thumbnail
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    onLoad={(e) => {
                      e.target.style.display = "block";
                    }}
                  />
                </div>
              )}
            </Form.Group>

            {/* Task 3.2: level - select box with 5 options: N1, N2, N3, N4, N5 */}
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

            {/* Task 3.2: estimatedTime - required, must be a number */}
            <Form.Group className="mb-3" controlId="estimatedTime">
              <Form.Label>Estimated Time (minutes)</Form.Label>
              <Field type="text" name="estimatedTime" as={Form.Control} />
              <ErrorMessage
                name="estimatedTime"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

            {/* Task 3.2: isCompleted - switch control, default false */}
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
