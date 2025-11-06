# 📚 Giải Thích Chi Tiết Source Code - FER202 PE Project

## 📋 Mục Lục
1. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [Giải Thích Chi Tiết Từng File](#giải-thích-chi-tiết-từng-file)
4. [Flow Hoạt Động](#flow-hoạt-động)
5. [Các Pattern & Best Practices](#các-pattern--best-practices)

---

## 🏗️ Tổng Quan Kiến Trúc

Dự án này là một **React Single Page Application (SPA)** quản lý danh sách bài học tiếng Nhật, sử dụng các công nghệ:

- **React 19**: UI Library
- **React Router DOM v7**: Client-side routing
- **React Bootstrap**: UI Components
- **Formik + Yup**: Form handling & validation
- **Axios**: HTTP client
- **Vite**: Build tool

### Kiến trúc tổng thể:
```
main.jsx → App.jsx → AppRoutes → MainLayout → [Components]
                                      ↓
                                  API Caller → Backend API
```

---

## 📁 Cấu Trúc Thư Mục

```
src/
├── api/                    # HTTP request handlers
│   └── apiCaller.js       # Centralized API service
├── components/             # All page components
│   ├── Navbar.jsx         # Navigation bar
│   ├── HomePage.jsx       # Trang chủ - lessons chưa hoàn thành
│   ├── AllLessonsPage.jsx # Danh sách tất cả lessons
│   ├── CompletedLessonsPage.jsx  # Lessons đã hoàn thành
│   ├── LessonDetailPage.jsx      # Chi tiết một lesson
│   └── AddLessonPage.jsx  # Form thêm/sửa lesson
├── layouts/                # Layout wrappers
│   └── MainLayout.jsx     # Main layout với Navbar
├── routes/                 # Route configurations
│   └── AppRoutes.jsx      # Route definitions
├── App.jsx                 # Root component
└── main.jsx               # Entry point
```

---

## 🔍 Giải Thích Chi Tiết Từng File

### 1. `main.jsx` - Entry Point

**Mục đích:** Điểm khởi đầu của ứng dụng React

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

**Giải thích:**
- `createRoot()`: React 18+ API để render app
- `StrictMode`: Bật chế độ kiểm tra strict, giúp phát hiện lỗi sớm
- `BrowserRouter`: Wrapper cho routing, quản lý URL history
- Import Bootstrap CSS để có sẵn các styles

**Tại sao code như thế?**
- `BrowserRouter` phải wrap `App` để toàn bộ app có thể sử dụng routing
- `StrictMode` giúp development tốt hơn với warnings về deprecated APIs

---

### 2. `App.jsx` - Root Component

**Mục đích:** Component gốc, kết nối routes với UI

```jsx
import { useRoutes } from "react-router-dom";
import getRoutes from "./routes/AppRoutes";

function App() {
  const routes = getRoutes();
  const element = useRoutes(routes);
  return element;
}
```

**Giải thích:**
- `useRoutes()`: Hook của React Router để render routes dựa trên config
- `getRoutes()`: Function trả về cấu hình routes
- Return trực tiếp `element` thay vì wrap trong JSX

**Tại sao code như thế?**
- Tách riêng route config ra file riêng (`AppRoutes.jsx`) giúp dễ quản lý
- `useRoutes()` là cách modern hơn so với `<Routes>` component
- Code gọn gàng, App.jsx chỉ là connector

---

### 3. `routes/AppRoutes.jsx` - Route Configuration

**Mục đích:** Định nghĩa tất cả routes của ứng dụng

```jsx
const routes = () => [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/SE181834/all-lessons", element: <AllLessonsPage /> },
      { path: "/SE181834/completed-lessons", element: <CompletedLessonsPage /> },
      { path: "/SE181834/lessons/:id", element: <LessonDetailPage /> },
      { path: "/add-lesson", element: <AddLessonPage /> },
      { path: "/SE181834/edit-lesson/:id", element: <AddLessonPage /> },
    ],
  },
];
```

**Giải thích từng route:**

| Route | Component | Mục đích |
|-------|-----------|----------|
| `/` | HomePage | Hiển thị lessons chưa hoàn thành |
| `/SE181834/all-lessons` | AllLessonsPage | Hiển thị tất cả lessons |
| `/SE181834/completed-lessons` | CompletedLessonsPage | Hiển thị lessons đã hoàn thành |
| `/SE181834/lessons/:id` | LessonDetailPage | Chi tiết một lesson (`:id` là dynamic param) |
| `/add-lesson` | AddLessonPage | Form thêm lesson mới |
| `/SE181834/edit-lesson/:id` | AddLessonPage | Form sửa lesson (dùng chung component) |

**Tại sao code như thế?**
- **Nested routes:** Tất cả routes là `children` của `MainLayout` → share navbar
- **Roll number trong URL:** `/SE181834/...` theo yêu cầu đề bài
- **Dynamic params:** `:id` cho phép truyền ID qua URL
- **Reuse component:** Add và Edit dùng chung `AddLessonPage`, phân biệt bằng có/không có `:id`

---

### 4. `layouts/MainLayout.jsx` - Layout Wrapper

**Mục đích:** Layout chung cho tất cả pages (Navbar + Content)

```jsx
export default function MainLayout() {
  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}
```

**Giải thích:**
- `<AppNavbar />`: Navigation bar cố định ở trên
- `<Container>`: Bootstrap container cho responsive
- `<Outlet />`: Placeholder nơi render child routes
- `mt-4`: Bootstrap margin-top utility class

**Tại sao code như thế?**
- **DRY Principle:** Không cần repeat Navbar ở mỗi page
- **Outlet pattern:** React Router's way để nest routes
- **Responsive:** Container tự động responsive theo screen size

---

### 5. `api/apiCaller.js` - API Service Layer

**Mục đích:** Centralized service để gọi API, tránh duplicate code

```jsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const request = async (method, endpoint, { body = {}, params = {}, headers = {} } = {}) => {
  try {
    const res = await api({
      url: endpoint,
      method,
      data: body,
      params,
      headers,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const get = (endpoint, params = {}, headers = {}) =>
  request("GET", endpoint, { params, headers });

export const post = (endpoint, body = {}, params = {}, headers = {}) =>
  request("POST", endpoint, { body, params, headers });

export const put = (endpoint, body = {}, params = {}, headers = {}) =>
  request("PUT", endpoint, { body, params, headers });

export const remove = (endpoint, params = {}, headers = {}) =>
  request("DELETE", endpoint, { params, headers });
```

**Giải thích từng phần:**

#### 1. Axios Instance
```jsx
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```
- Tạo instance riêng với `baseURL` từ env variable
- Vite sử dụng `import.meta.env` thay vì `process.env`
- Giúp config base URL một chỗ, dùng cho toàn bộ app

#### 2. Generic Request Function
```jsx
const request = async (method, endpoint, { body = {}, params = {}, headers = {} } = {})
```
- **Tham số:**
  - `method`: HTTP method (GET, POST, PUT, DELETE)
  - `endpoint`: API endpoint (e.g., `/lessons`, `/:id`)
  - `body`: Request body cho POST/PUT
  - `params`: Query parameters cho GET
  - `headers`: Custom headers nếu cần
- **Try-catch:** Bắt lỗi và throw cho component xử lý
- **Return `res.data`:** Chỉ trả về data, bỏ metadata của axios

#### 3. Exported Functions
- `get()`, `post()`, `put()`, `remove()`: Wrapper functions cho từng HTTP method
- Giúp code component sạch hơn: `get('/lessons')` thay vì `axios.get(...)`

**Tại sao code như thế?**
- **Single Responsibility:** Mỗi function làm một việc
- **Reusability:** Dùng chung logic request
- **Error Handling:** Centralized error handling
- **Type Safety:** Clear function signature
- **Environment Variables:** Easy to change API URL giữa dev/prod

---

### 6. `components/Navbar.jsx` - Navigation Component

**Mục đích:** Thanh điều hướng chính của ứng dụng

```jsx
export default function AppNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">SE181834</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/SE181834/all-lessons">All Lessons</Nav.Link>
            <Nav.Link as={Link} to="/SE181834/completed-lessons">Completed Lessons</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
```

**Giải thích:**
- **React Bootstrap Components:** Sử dụng pre-built components
- **`as={Link}`:** Integrate React Router's Link với Bootstrap Nav
- **`bg="dark"` + `data-bs-theme="dark"`:** Dark theme navbar
- **`expand="lg"`:** Responsive collapse trên mobile
- **`Navbar.Brand`:** Logo/Brand link về home
- **`Navbar.Toggle`:** Hamburger menu cho mobile

**Tại sao code như thế?**
- **React Router Integration:** `as={Link}` giữ SPA behavior (không reload page)
- **Responsive:** Tự động collapse thành hamburger menu trên mobile
- **Bootstrap Theme:** Consistent với design system
- **Accessibility:** `aria-controls` giúp screen readers

---

### 7. `components/HomePage.jsx` - Home Page

**Mục đích:** Hiển thị danh sách lessons chưa hoàn thành ở dạng grid

```jsx
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

  // ... render
}
```

**Giải thích State Management:**
- **`lessons`:** Mảng chứa dữ liệu lessons
- **`loading`:** Boolean để show spinner khi fetch data
- **`error`:** Lưu error message nếu có lỗi

**Giải thích useEffect:**
```jsx
useEffect(() => {
  const fetchLessons = async () => {
    // Fetch logic
  };
  fetchLessons();
}, []); // Empty deps array = chỉ chạy 1 lần khi mount
```
- **Empty dependency array `[]`:** Effect chỉ chạy khi component mount
- **Async function inside:** Không thể dùng `async` trực tiếp trong useEffect
- **Filter logic:** `.filter((lesson) => !lesson.isCompleted)` chỉ lấy chưa hoàn thành

**Giải thích Event Handler:**
```jsx
const handleImageClick = (id) => {
  navigate(`/SE181834/lessons/${id}`);
};
```
- Click vào ảnh → navigate đến detail page
- Sử dụng `navigate()` hook của React Router

**Render Logic:**
```jsx
if (loading) return <Spinner />;
if (error) return <Alert variant="danger">{error}</Alert>;

return (
  <Row xs={1} md={2} lg={3} className="g-4">
    {lessons.map((lesson) => (
      <Col key={lesson.id}>
        <Card className="h-100">
          <Card.Img onClick={() => handleImageClick(lesson.id)} />
          <Card.Body>
            <Card.Title>{lesson.lessonTitle}</Card.Title>
            {/* ... */}
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);
```
- **Conditional rendering:** Loading → Spinner, Error → Alert
- **Grid layout:** `Row` + `Col` với responsive breakpoints
  - `xs={1}`: 1 column trên mobile
  - `md={2}`: 2 columns trên tablet
  - `lg={3}`: 3 columns trên desktop
- **`h-100`:** Card cao 100% để các cards trong cùng row cao bằng nhau
- **`key={lesson.id}`:** React key để optimize re-renders

**Tại sao code như thế?**
- **Loading state:** UX tốt hơn, user biết đang tải
- **Error handling:** Hiển thị lỗi thay vì crash
- **Filter client-side:** Backend trả full list, filter ở frontend
- **Click handler trên image:** Intuitive UX
- **Responsive grid:** Tự động adjust theo screen size

---

### 8. `components/AllLessonsPage.jsx` - All Lessons Page

**Mục đích:** Hiển thị tất cả lessons với chức năng Edit/Delete

**State & Logic chính:**
```jsx
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastVariant, setToastVariant] = useState("success");

const fetchLessons = async () => {
  const data = await get("/");
  const sortedData = data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  setLessons(sortedData);
};
```

**Giải thích Sorting:**
```jsx
data.sort((a, b) => parseInt(b.id) - parseInt(a.id))
```
- **Descending order:** `b.id - a.id` (id lớn trước, id nhỏ sau)
- **parseInt():** Đảm bảo so sánh số, không phải string

**Giải thích Toast Notification:**
```jsx
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastVariant, setToastVariant] = useState("success");
```
- **3 states riêng:** Control toast visibility, message, và màu
- **Toast thay vì alert():** UX tốt hơn, không block UI

**Event Handlers:**

#### 1. handleItemClick
```jsx
const handleItemClick = (id) => {
  navigate(`/SE181834/lessons/${id}`);
};
```
- Click vào row → navigate đến detail page

#### 2. handleEdit
```jsx
const handleEdit = (e, id) => {
  e.stopPropagation();
  navigate(`/SE181834/edit-lesson/${id}`);
};
```
- **`e.stopPropagation()`:** Ngăn click event bubble lên row
- Navigate đến edit page với ID

#### 3. handleDelete
```jsx
const handleDelete = async (e, id) => {
  e.stopPropagation();
  
  const isConfirmed = window.confirm("Are you sure?");
  
  if (isConfirmed) {
    try {
      await remove(`/${id}`);
      setToastMessage("Lesson deleted successfully!");
      setToastVariant("success");
      setShowToast(true);
      fetchLessons();
    } catch (err) {
      setToastMessage(`Error: ${err.message}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  }
};
```
- **Confirmation dialog:** UX safety, tránh xóa nhầm
- **Try-catch:** Handle cả success và error
- **Toast feedback:** Inform user về kết quả
- **Re-fetch data:** Update UI sau khi xóa

**Render Table:**
```jsx
<Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>ID</th>
      <th>Lesson Title</th>
      <th>Level</th>
      <th>Estimated Time (min)</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {lessons.map((lesson) => (
      <tr key={lesson.id} onClick={() => handleItemClick(lesson.id)}>
        <td>{lesson.id}</td>
        <td>{lesson.lessonTitle}</td>
        <td>{lesson.level}</td>
        <td>{lesson.estimatedTime}</td>
        <td>
          <Button variant="warning" onClick={(e) => handleEdit(e, lesson.id)}>
            Edit
          </Button>
          <Button variant="danger" onClick={(e) => handleDelete(e, lesson.id)}>
            Delete
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```
- **Table props:**
  - `striped`: Zebra stripes cho dễ đọc
  - `bordered`: Border giữa các cells
  - `hover`: Highlight row khi hover
  - `responsive`: Scroll horizontal trên mobile
- **Click handlers:** Truyền `(e, id)` để handle event và ID

**Toast Component:**
```jsx
<ToastContainer position="top-end" className="p-3">
  <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
    <Toast.Header>
      <strong>{toastVariant === "success" ? "Success" : "Error"}</strong>
    </Toast.Header>
    <Toast.Body>{toastMessage}</Toast.Body>
  </Toast>
</ToastContainer>
```
- **`position="top-end"`:** Xuất hiện góc trên bên phải
- **`delay={3000}`:** Tự động ẩn sau 3 giây
- **`autohide`:** Enable auto-hide feature
- **`bg={toastVariant}`:** Dynamic background color (success/danger)

**Tại sao code như thế?**
- **Toast notification:** Modern UX, không block user
- **Confirmation dialog:** Prevent accidental deletion
- **stopPropagation():** Tránh trigger click row khi click button
- **Re-fetch after delete:** Ensure UI sync với backend
- **Responsive table:** Work tốt trên mọi device

---

### 9. `components/CompletedLessonsPage.jsx` - Completed Lessons

**Mục đích:** Hiển thị lessons đã hoàn thành với hình ảnh

**Logic khác với AllLessonsPage:**
```jsx
const completed = data.filter((lesson) => lesson.isCompleted);
const sortedData = completed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
```
- Filter ngược lại: `lesson.isCompleted === true`
- Sort giống nhau: descending by ID

**Render với Image:**
```jsx
<Table>
  <tbody>
    {lessons.map((lesson) => (
      <tr onClick={() => handleItemClick(lesson.id)}>
        <td>
          <Image
            src={lesson.lessonImage}
            thumbnail
            style={{ width: "100px", height: "auto" }}
          />
        </td>
        <td>{lesson.lessonTitle}</td>
        <td>{lesson.level}</td>
      </tr>
    ))}
  </tbody>
</Table>
```
- **Bootstrap Image:** `thumbnail` prop thêm border
- **Fixed width:** `width: "100px"` để consistent
- **`height: "auto"`:** Maintain aspect ratio

**Tại sao code như thế?**
- **Hiển thị image:** Visual cue cho completed lessons
- **List layout thay vì grid:** Compact hơn, phù hợp với data nhiều
- **Click entire row:** Easy navigation

---

### 10. `components/LessonDetailPage.jsx` - Lesson Detail

**Mục đích:** Hiển thị chi tiết đầy đủ của một lesson

**Fetch Single Lesson:**
```jsx
const { id } = useParams();

useEffect(() => {
  const fetchLesson = async () => {
    const data = await get(`/${id}`);
    setLesson(data);
  };
  fetchLesson();
}, [id]);
```
- **`useParams()`:** Lấy `:id` từ URL params
- **Dependency `[id]`:** Re-fetch khi ID thay đổi

**Format Estimated Time:**
```jsx
const formatTime = (time) => {
  return new Intl.NumberFormat().format(time);
};
```
- **`Intl.NumberFormat()`:** Built-in JavaScript API
- Tự động thêm comma separator: `1200` → `1,200`
- **Locale-aware:** Tự động theo locale của browser

**Render Detail:**
```jsx
<Card className="w-75 mx-auto">
  <Card.Header as="h3">{lesson.lessonTitle}</Card.Header>
  <Card.Img src={lesson.lessonImage} style={{ maxHeight: "400px", objectFit: "cover" }} />
  <Card.Body>
    <ListGroup variant="flush">
      <ListGroup.Item><strong>Level:</strong> {lesson.level}</ListGroup.Item>
      <ListGroup.Item>
        <strong>Status:</strong> {lesson.isCompleted ? "Completed" : "Not Completed"}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>Estimated Time:</strong> {formatTime(lesson.estimatedTime)} minutes
      </ListGroup.Item>
    </ListGroup>
    <Button onClick={() => navigate(-1)}>Back to list</Button>
  </Card.Body>
</Card>
```
- **`w-75 mx-auto`:** Width 75%, center horizontally
- **`maxHeight: "400px"`:** Limit image height
- **`objectFit: "cover"`:** Crop image nếu quá lớn, giữ aspect ratio
- **`variant="flush"`:** ListGroup không có border
- **`navigate(-1)`:** Back về trang trước (browser history)

**Conditional Rendering:**
```jsx
if (loading) return <Spinner />;
if (error) return <Alert variant="danger">{error}</Alert>;
if (!lesson) return <Alert variant="warning">Lesson not found.</Alert>;
```
- 3 states: Loading, Error, Not Found

**Tại sao code như thế?**
- **Card layout:** Clean, professional presentation
- **ListGroup:** Organized key-value pairs
- **Number formatting:** Better readability
- **Back button:** Easy navigation
- **Conditional status:** Clear visual indicator

---

### 11. `components/AddLessonPage.jsx` - Add/Edit Form

**Mục đích:** Form thêm/sửa lesson với validation

**Validation Schema với Yup:**
```jsx
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
```

**Giải thích từng validation:**

#### 1. lessonTitle
```jsx
.trim()                                    // Xóa spaces đầu/cuối
.matches(/(\s)/, "Must contain more than 1 word")  // Phải có ít nhất 1 space (2+ words)
.required("Lesson Title is required")      // Bắt buộc
```
- **Regex `/(\s)/`:** Match bất kỳ whitespace nào
- Đảm bảo có nhiều hơn 1 từ

#### 2. lessonImage
```jsx
.url("Must be a valid URL")                // Validate URL format
.required("Lesson Image is required")
```
- Yup's built-in URL validator
- Check format: `http://` hoặc `https://`

#### 3. estimatedTime
```jsx
.number()                                  // Phải là number
.typeError("Must be a number")            // Custom error message
.required("Estimated Time is required")
```
- **`.typeError()`:** Override default type error message

**Edit vs Add Mode:**
```jsx
const { id } = useParams();
const isEditMode = Boolean(id);

useEffect(() => {
  if (isEditMode) {
    setLoading(true);
    get(`/${id}`)
      .then((data) => {
        setInitialValues(data);
        setLoading(false);
      });
  }
}, [id, isEditMode]);
```
- **Check ID:** Có ID = Edit mode, không = Add mode
- **Pre-populate:** Fetch data và set vào form nếu Edit

**Formik Integration:**
```jsx
<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  enableReinitialize
>
  {({ isSubmitting }) => (
    <FormikForm>
      {/* Fields */}
    </FormikForm>
  )}
</Formik>
```

**Giải thích Formik props:**
- **`initialValues`:** Default values khi form load
- **`validationSchema`:** Yup schema để validate
- **`onSubmit`:** Handler khi submit
- **`enableReinitialize`:** Re-initialize form khi `initialValues` thay đổi (quan trọng cho Edit mode)
- **Render prop:** `{({ isSubmitting }) => ...}` để access Formik state

**Field Components:**
```jsx
<Form.Group className="mb-3" controlId="lessonTitle">
  <Form.Label>Lesson Title</Form.Label>
  <Field type="text" name="lessonTitle" as={Form.Control} />
  <ErrorMessage name="lessonTitle" component={Form.Text} className="text-danger" />
</Form.Group>
```

**Giải thích:**
- **`Field`:** Formik's controlled input
- **`as={Form.Control}`:** Render as Bootstrap Form.Control
- **`ErrorMessage`:** Automatically show validation errors
- **`name` prop:** Phải match với key trong `initialValues` và `validationSchema`

**Select Field:**
```jsx
<Field as={Form.Select} name="level">
  <option value="N5">N5</option>
  <option value="N4">N4</option>
  <option value="N3">N3</option>
  <option value="N2">N2</option>
  <option value="N1">N1</option>
</Field>
```
- **`as={Form.Select}`:** Render as select dropdown
- Hard-coded options theo đề bài

**Switch Control:**
```jsx
<Field as={FormCheck} type="switch" name="isCompleted" label="Is Completed?" />
```
- **`type="switch"`:** Toggle switch thay vì checkbox
- **`label`:** Text bên cạnh switch

**Submit Handler:**
```jsx
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
```

**Giải thích:**
- **2 tham số:** `values` (form data) và Formik helpers
- **Conditional API call:** PUT nếu Edit, POST nếu Add
- **`setSubmitting(false)`:** Reset submit state (enable button lại)
- **Navigate after success:** Redirect về All Lessons page
- **Error handling:** Catch và display error

**Submit Button:**
```jsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <Spinner as="span" size="sm" />
  ) : isEditMode ? (
    "Update Lesson"
  ) : (
    "Add Lesson"
  )}
</Button>
```
- **`disabled={isSubmitting}`:** Prevent double submission
- **Conditional text:** "Update" hoặc "Add"
- **Loading spinner:** Show khi đang submit

**Tại sao code như thế?**
- **Formik + Yup:** Industry standard cho form handling
- **Declarative validation:** Dễ đọc, dễ maintain
- **Automatic error handling:** ErrorMessage component
- **Reuse component:** Dùng chung cho Add và Edit
- **enableReinitialize:** Crucial cho Edit mode
- **Controlled inputs:** Formik quản lý state
- **UX feedback:** Spinner, disable button khi submit

---

## 🔄 Flow Hoạt Động

### Flow 1: User Mở Ứng Dụng

```
1. Browser load index.html
   ↓
2. Load main.jsx
   ↓
3. Render <BrowserRouter><App /></BrowserRouter>
   ↓
4. App.jsx call useRoutes(routes)
   ↓
5. Match route "/" → Render <MainLayout>
   ↓
6. MainLayout render <Navbar> + <Outlet>
   ↓
7. Outlet render <HomePage />
   ↓
8. HomePage useEffect → Fetch API
   ↓
9. Show loading spinner
   ↓
10. API response → Set lessons state
   ↓
11. Render grid of lesson cards
```

### Flow 2: User Click Vào Lesson Card

```
1. User click Card.Img
   ↓
2. handleImageClick(id) được gọi
   ↓
3. navigate(`/SE181834/lessons/${id}`)
   ↓
4. React Router match route → Render LessonDetailPage
   ↓
5. LessonDetailPage useEffect → Fetch lesson by ID
   ↓
6. Render detail với formatted time
```

### Flow 3: User Delete Lesson

```
1. User click Delete button trong AllLessonsPage
   ↓
2. handleDelete(e, id) được gọi
   ↓
3. e.stopPropagation() → Prevent row click
   ↓
4. window.confirm() → Show confirmation
   ↓
5. User confirm → Call API remove(`/${id}`)
   ↓
6. Success → Set toast message & variant
   ↓
7. setShowToast(true) → Show toast notification
   ↓
8. fetchLessons() → Re-fetch updated list
   ↓
9. Toast auto-hide sau 3 giây
```

### Flow 4: User Add/Edit Lesson

```
1. User click "Add New Lesson" hoặc "Edit" button
   ↓
2. Navigate đến /add-lesson hoặc /SE181834/edit-lesson/:id
   ↓
3. AddLessonPage mount
   ↓
4. Check isEditMode = Boolean(id)
   ↓
5. Nếu Edit: useEffect → Fetch lesson by ID
   ↓
6. setInitialValues(data) → Pre-populate form
   ↓
7. Formik enableReinitialize → Update form
   ↓
8. User fill/edit form
   ↓
9. Formik validate on blur/change (real-time)
   ↓
10. User click Submit
   ↓
11. Formik validate toàn bộ form
   ↓
12. Nếu valid → Call handleSubmit
   ↓
13. Nếu Edit: PUT, Nếu Add: POST
   ↓
14. Success → alert() → navigate("/SE181834/all-lessons")
   ↓
15. AllLessonsPage re-mount → Show updated list
```

---

## 🎯 Các Pattern & Best Practices

### 1. **Component Composition Pattern**
```jsx
<MainLayout>  ← Layout wrapper
  <Navbar />  ← Persistent component
  <Outlet />  ← Dynamic content
</MainLayout>
```
- Tách layout ra khỏi content
- Reuse navbar across all pages

### 2. **Custom Hooks Pattern**
Có thể refactor thành:
```jsx
// hooks/useFetchLessons.js
export const useFetchLessons = (filter) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  // ... logic
  return { lessons, loading, error, refetch };
};
```

### 3. **Container/Presenter Pattern**
Hiện tại: Components vừa fetch data vừa render (mixed)
Có thể tách:
- Container components: Handle logic, state
- Presenter components: Pure UI

### 4. **Single Responsibility Principle**
- `apiCaller.js`: Chỉ lo API calls
- `AppRoutes.jsx`: Chỉ lo routing config
- Components: Mỗi component một mục đích rõ ràng

### 5. **DRY (Don't Repeat Yourself)**
- API caller: Reuse request logic
- AddLessonPage: Reuse cho Add và Edit
- MainLayout: Share navbar

### 6. **Error Handling Pattern**
```jsx
try {
  // API call
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```
- Consistent error handling
- Always reset loading state

### 7. **Conditional Rendering Pattern**
```jsx
if (loading) return <Spinner />;
if (error) return <Alert />;
return <MainContent />;
```
- Early returns cho cleaner code
- Separate concerns

### 8. **Event Handler Naming**
- `handleImageClick`: Click handler
- `handleSubmit`: Form submit
- `handleDelete`: Delete action
- Prefix "handle" cho event handlers

### 9. **State Management**
- Local state với `useState` cho component-specific data
- No global state needed (project nhỏ)
- Có thể scale với Context API hoặc Redux nếu cần

### 10. **Validation Pattern**
```jsx
validationSchema + Formik
```
- Declarative validation
- Separate validation logic from UI
- Reusable schema

---

## 🚀 Có Thể Cải Thiện

### 1. **Custom Hooks**
```jsx
// hooks/useLessons.js
export const useLessons = () => {
  // Shared logic cho fetch lessons
};
```

### 2. **Constants File**
```jsx
// constants/routes.js
export const ROUTES = {
  HOME: "/",
  ALL_LESSONS: "/SE181834/all-lessons",
  // ...
};
```

### 3. **Environment Config**
```jsx
// config/env.js
export const API_URL = import.meta.env.VITE_API_URL;
export const ROLL_NUMBER = "SE181834";
```

### 4. **Error Boundary**
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 5. **Loading Component**
```jsx
// components/Loading.jsx
export const Loading = () => <Spinner />;
```

### 6. **Toast Service**
```jsx
// services/toast.js
export const showToast = (message, variant) => {
  // Centralized toast logic
};
```

### 7. **PropTypes hoặc TypeScript**
```jsx
HomePage.propTypes = {
  // Define prop types
};
```

### 8. **Memoization**
```jsx
const sortedLessons = useMemo(() => 
  lessons.sort(...), 
  [lessons]
);
```

### 9. **Lazy Loading**
```jsx
const HomePage = lazy(() => import('./components/HomePage'));
```

### 10. **Testing**
- Unit tests cho utils
- Integration tests cho components
- E2E tests cho flows

---

## 📝 Kết Luận

Source code này được organize tốt với:
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Proper error handling
- ✅ Good UX với loading states và notifications
- ✅ Form validation
- ✅ Responsive design
- ✅ Clean code structure

Đây là một **production-ready** React application với best practices của modern React development.
