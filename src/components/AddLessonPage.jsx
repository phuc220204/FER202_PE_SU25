import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form, Button, Spinner, Alert, FormCheck } from "react-bootstrap";
import { get, post, put } from "../api/apiCaller";

const validationSchema = Yup.object().shape({
  lessonTitle: Yup.string()
    .trim()
    .matches(/(\s)/, "Must contain more than 1 word")
    .required("Lesson Title is required"),

  lessonImage: Yup.string()
    .url("Must be a valid URL")
    .required("Lesson Image is required"),

  level: Yup.string().required("Level is required"),

  estimatedTime: Yup.number()
    .typeError("Must be a number")
    .required("Estimated Time is required"),

  isCompleted: Yup.boolean(),
});

export default function AddLessonPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    lessonTitle: "",
    lessonImage: "",
    level: "N5",
    estimatedTime: "",
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        alert("Lesson updated successfully!");
      } else {
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

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <FormikForm>
            <Form.Group className="mb-3" controlId="lessonTitle">
              <Form.Label>Lesson Title</Form.Label>
              <Field type="text" name="lessonTitle" as={Form.Control} />
              <ErrorMessage
                name="lessonTitle"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lessonImage">
              <Form.Label>Lesson Image URL</Form.Label>
              <Field type="text" name="lessonImage" as={Form.Control} />
              <ErrorMessage
                name="lessonImage"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

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

            <Form.Group className="mb-3" controlId="estimatedTime">
              <Form.Label>Estimated Time (minutes)</Form.Label>
              <Field type="text" name="estimatedTime" as={Form.Control} />
              <ErrorMessage
                name="estimatedTime"
                component={Form.Text}
                className="text-danger"
              />
            </Form.Group>

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
