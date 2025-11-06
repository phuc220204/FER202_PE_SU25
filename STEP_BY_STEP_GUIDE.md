# 📘 Hướng Dẫn Từng Bước Hoàn Thành PE FER202

## 📋 Mục Lục
1. [Setup Project](#setup-project)
2. [Task 1: Setup API](#task-1-setup-api)
3. [Task 2: Navigation & Pages](#task-2-navigation--pages)
4. [Task 3: Detail & CRUD](#task-3-detail--crud)
5. [Giải Thích Chi Tiết Code Theo Yêu Cầu Đề](#giải-thích-chi-tiết-code-theo-yêu-cầu-đề)

---

## 🚀 Setup Project

### Bước 1: Tạo React App với Vite

```bash
npm create vite@latest SE181834 -- --template react
cd SE181834
npm install
```

**Tại sao dùng Vite?**
- ⚡ Nhanh hơn Create React App
- 🎯 Modern build tool
- 📦 Smaller bundle size

### Bước 2: Install Dependencies

```bash
npm install react-router-dom react-bootstrap bootstrap axios formik yup
```

**Giải thích từng package:**
- `react-router-dom`: Routing (yêu cầu đề Task 2.1)
- `react-bootstrap` + `bootstrap`: UI components
- `axios`: HTTP client để call API
- `formik` + `yup`: Form validation (yêu cầu đề Task 3.2)

### Bước 3: Tạo File .env

```env
VITE_API_URL=https://67207ad3e7a5792f052e9e84.mockapi.io/SE181834
```

**Tại sao phải dùng .env?**
> ⚠️ ĐỀ BÀI YÊU CẦU: "Your work will be considered invalid (0 point) if your code does not use the .env file to store the API URL."

---

## 📦 Task 1: Setup API

### Task 1.1 (0.25 mark): Create Resource on MockAPI

**Các bước:**
1. Vào https://mockapi.io
2. Đăng nhập/đăng ký
3. Create New Project
4. Create Resource tên: `SE181834` (roll number của bạn)
5. Define Schema:

| Field | Type | Description |
|-------|------|-------------|
| id | String | Auto-generated |
| lessonTitle | String | Tên bài học |
| lessonImage | String | URL hình ảnh |
| level | String | Cấp độ (N1-N5) |
| isCompleted | Boolean | Đã hoàn thành chưa |
| estimatedTime | Number | Thời gian ước tính (phút) |

### Task 1.2 (0.25 mark): Import Data

**Copy nội dung file `jlpt_lessons.json` vào MockAPI**

Ví dụ data:
```json
[
  {
    "id": "1",
    "lessonTitle": "Basic Kanji Reading",
    "lessonImage": "https://picsum.photos/400/300?random=1",
    "level": "N5",
    "isCompleted": false,
    "estimatedTime": 1200
  }
]
```

**Tại sao cần import data?**
- Để có dữ liệu test
- Đề bài yêu cầu copy từ file json

---

## 🏗️ Cấu Trúc Project

```
SE181834/
├── .env                    # API URL
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Root component
│   ├── api/
│   │   └── apiCaller.js   # API service
│   ├── components/
│   │   ├── Navbar.jsx     # Task 2.1
│   │   ├── HomePage.jsx   # Task 2.2
│   │   ├── AllLessonsPage.jsx        # Task 2.3 + 3.3 + 3.4
│   │   ├── CompletedLessonsPage.jsx  # Task 2.4
│   │   ├── LessonDetailPage.jsx      # Task 3.1
│   │   └── AddLessonPage.jsx         # Task 3.2 + 3.4
│   ├── layouts/
│   │   └── MainLayout.jsx
│   └── routes/
│       └── AppRoutes.jsx
```

---

## 📝 Task 2: Navigation & Pages

### Task 2.1 (1.0 mark): Create Navbar

**Yêu cầu đề:**
> Create a Navbar for navigating all the routes in your application. Including: Home, All Lessons, Completed Lessons.

**Tại sao code như vậy:**

```jsx
// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

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

**Giải thích theo yêu cầu đề:**

1. **"Including: Home, All Lessons, Completed Lessons"**
   - ✅ Có đủ 3 links: Home, All Lessons, Completed Lessons
   
2. **Tại sao dùng `as={Link}`?**
   - Để integrate React Router với React Bootstrap
   - Giữ SPA behavior (không reload trang)
   
3. **Tại sao dùng React Bootstrap?**
   - Responsive tự động
   - Professional UI
   - Mobile-friendly với hamburger menu

---

### Task 2.2 (2.0 marks): Home Route - Uncompleted Lessons

**Yêu cầu đề:**
> At the Home route, display all lessons that are not completed (isCompleted == false). Show them in a grid layout. Each lesson card must contain: lessonTitle, lessonImage, level, and estimatedTime (in minutes). When clicking on the lesson image, the view should navigate to the Lesson Detail page.

**Code Implementation:**

```jsx
// src/components/HomePage.jsx
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
        // YÊU CẦU: display all lessons that are not completed
        setLessons(data.filter((lesson) => !lesson.isCompleted));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // YÊU CẦU: When clicking on the lesson image, navigate to Detail page
  const handleImageClick = (id) => {
    navigate(`/SE181834/lessons/${id}`);
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">Uncompleted Lessons</h2>
      {/* YÊU CẦU: Show them in a grid layout */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {lessons.map((lesson) => (
          <Col key={lesson.id}>
            <Card className="h-100">
              {/* YÊU CẦU: lessonImage - clicking navigates to Detail */}
              <Card.Img
                variant="top"
                src={lesson.lessonImage}
                onClick={() => handleImageClick(lesson.id)}
                style={{ cursor: "pointer" }}
              />
              <Card.Body>
                {/* YÊU CẦU: lessonTitle, level, estimatedTime */}
                <Card.Title>{lesson.lessonTitle}</Card.Title>
                <Card.Text>
                  <strong>Level:</strong> {lesson.level}<br />
                  <strong>Time:</strong> {lesson.estimatedTime} minutes
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
```

**Giải thích từng yêu cầu:**

#### 1. "display all lessons that are not completed (isCompleted == false)"
```jsx
setLessons(data.filter((lesson) => !lesson.isCompleted));
```
- **Tại sao filter?** Chỉ lấy lessons chưa hoàn thành
- **`!lesson.isCompleted`** tương đương `isCompleted == false`

#### 2. "Show them in a grid layout"
```jsx
<Row xs={1} md={2} lg={3} className="g-4">
  <Col>...</Col>
</Row>
```
- **`xs={1}`**: 1 cột trên mobile
- **`md={2}`**: 2 cột trên tablet
- **`lg={3}`**: 3 cột trên desktop
- **`g-4`**: Gap spacing giữa các items
- **Tại sao responsive?** UX tốt trên mọi device

#### 3. "Each lesson card must contain: lessonTitle, lessonImage, level, and estimatedTime"
```jsx
<Card.Img src={lesson.lessonImage} />  {/* lessonImage */}
<Card.Title>{lesson.lessonTitle}</Card.Title>  {/* lessonTitle */}
<strong>Level:</strong> {lesson.level}  {/* level */}
<strong>Time:</strong> {lesson.estimatedTime} minutes  {/* estimatedTime */}
```
- ✅ Có đủ 4 fields như yêu cầu

#### 4. "When clicking on the lesson image, the view should navigate to the Lesson Detail page"
```jsx
<Card.Img onClick={() => handleImageClick(lesson.id)} />

const handleImageClick = (id) => {
  navigate(`/SE181834/lessons/${id}`);
};
```
- **Click image** → trigger `handleImageClick`
- Navigate đến URL `/SE181834/lessons/:id`
- **Tại sao pass `id`?** Để Detail page biết load lesson nào

#### 5. Tại sao cần loading & error states?
```jsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```
- **Loading:** Show spinner khi đang fetch API
- **Error:** Hiển thị message nếu API fail
- **Best practice:** Always handle loading & error states

---

### Task 2.3 (1.0 mark): All Lessons Route

**Yêu cầu đề:**
> At the All Lessons route (URL must be /rollnumber/all-lessons, e.g., /se123456/all-lessons), display the full list of lessons in a list layout. Each item must show: lessonTitle, level, and estimatedTime. Each row must include links or icons for Edit and Delete actions. The list must be automatically sorted in descending order by the id field. Clicking a lesson item should navigate to the Lesson Detail page.

**Code Implementation:**

```jsx
// src/components/AllLessonsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get, remove } from "../api/apiCaller";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

export default function AllLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await get("/");
      
      // YÊU CẦU: sorted in descending order by the id field
      const sortedData = data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      
      setLessons(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // YÊU CẦU: Clicking a lesson item should navigate to Detail page
  const handleItemClick = (id) => {
    navigate(`/SE181834/lessons/${id}`);
  };

  // YÊU CẦU: Edit action (Task 3.4)
  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/SE181834/edit-lesson/${id}`);
  };

  // YÊU CẦU: Delete action (Task 3.3)
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    // Task 3.3: Show confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this lesson?");
    
    if (isConfirmed) {
      try {
        await remove(`/${id}`);
        alert("Lesson deleted successfully!");
        // Task 3.3: Reload the lesson list
        fetchLessons();
      } catch (err) {
        alert(`Error deleting lesson: ${err.message}`);
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Lessons</h2>
        <Button variant="success" onClick={() => navigate("/add-lesson")}>
          + Add New Lesson
        </Button>
      </div>

      {/* YÊU CẦU: display in a list layout */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            {/* YÊU CẦU: lessonTitle, level, estimatedTime */}
            <th>Lesson Title</th>
            <th>Level</th>
            <th>Estimated Time (min)</th>
            {/* YÊU CẦU: Edit and Delete actions */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr
              key={lesson.id}
              onClick={() => handleItemClick(lesson.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{lesson.id}</td>
              <td>{lesson.lessonTitle}</td>
              <td>{lesson.level}</td>
              <td>{lesson.estimatedTime}</td>
              <td>
                <Button variant="warning" size="sm" onClick={(e) => handleEdit(e, lesson.id)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={(e) => handleDelete(e, lesson.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
```

**Giải thích từng yêu cầu:**

#### 1. "URL must be /rollnumber/all-lessons"
```jsx
// src/routes/AppRoutes.jsx
{
  path: '/SE181834/all-lessons',  // ✅ Đúng format
  element: <AllLessonsPage />,
}
```
- **Tại sao phải đúng URL?** Đề bài yêu cầu strict format
- Replace `SE181834` bằng roll number của bạn

#### 2. "display the full list of lessons in a list layout"
```jsx
<Table striped bordered hover responsive>
  {/* Table layout = list layout */}
</Table>
```
- **Tại sao dùng Table?** Đề nói "list layout", table là best choice
- **Props:**
  - `striped`: Zebra stripes
  - `bordered`: Borders
  - `hover`: Highlight on hover
  - `responsive`: Scroll trên mobile

#### 3. "Each item must show: lessonTitle, level, and estimatedTime"
```jsx
<td>{lesson.lessonTitle}</td>  {/* lessonTitle */}
<td>{lesson.level}</td>        {/* level */}
<td>{lesson.estimatedTime}</td> {/* estimatedTime */}
```
- ✅ Có đủ 3 fields yêu cầu

#### 4. "Each row must include links or icons for Edit and Delete actions"
```jsx
<Button variant="warning" onClick={(e) => handleEdit(e, lesson.id)}>
  Edit
</Button>
<Button variant="danger" onClick={(e) => handleDelete(e, lesson.id)}>
  Delete
</Button>
```
- **Tại sao 2 buttons?** Đề yêu cầu Edit và Delete
- **Tại sao `onClick={(e) => handler(e, id)}`?** Pass event và ID

#### 5. "The list must be automatically sorted in descending order by the id field"
```jsx
const sortedData = data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
```
- **`parseInt(b.id) - parseInt(a.id)`**: Descending order (lớn → nhỏ)
- **Tại sao parseInt?** ID có thể là string, phải convert sang number
- **Automatically:** Sort ngay sau khi fetch, không cần user action

#### 6. "Clicking a lesson item should navigate to the Lesson Detail page"
```jsx
<tr onClick={() => handleItemClick(lesson.id)}>

const handleItemClick = (id) => {
  navigate(`/SE181834/lessons/${id}`);
};
```
- Click anywhere trong row → navigate
- **Tại sao `style={{ cursor: "pointer" }}`?** Visual cue cho user

#### 7. Tại sao cần `e.stopPropagation()`?
```jsx
const handleEdit = (e, id) => {
  e.stopPropagation();  // ← Important!
  navigate(`/SE181834/edit-lesson/${id}`);
};
```
- **Vấn đề:** Row có `onClick`, button cũng có `onClick`
- **Không có stopPropagation:** Click button → trigger cả button và row click
- **Có stopPropagation:** Click button → chỉ trigger button, không trigger row
- **Result:** Click Edit → navigate Edit page, không navigate Detail page

---

### Task 2.4 (1.0 mark): Completed Lessons Route

**Yêu cầu đề:**
> At the Completed Lessons route (URL must be /rollnumber/completed-lessons, e.g., /se123456/completed-lessons), display all lessons that are completed (isCompleted == true) in a list layout. Each item must show: lessonTitle, level, and lessonImage. Sort the lessons automatically in descending order by id. Clicking a lesson item should navigate to the Lesson Detail page.

**Code Implementation:**

```jsx
// src/components/CompletedLessonsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Table, Spinner, Alert, Image } from "react-bootstrap";

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
        
        // YÊU CẦU: display all lessons that are completed
        const completed = data.filter((lesson) => lesson.isCompleted);
        
        // YÊU CẦU: Sort in descending order by id
        const sortedData = completed.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        
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

  // YÊU CẦU: Clicking a lesson item navigates to Detail page
  const handleItemClick = (id) => {
    navigate(`/SE181834/lessons/${id}`);
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">Completed Lessons</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {/* YÊU CẦU: lessonTitle, level, lessonImage */}
            <th>Image</th>
            <th>Lesson Title</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr
              key={lesson.id}
              onClick={() => handleItemClick(lesson.id)}
              style={{ cursor: "pointer" }}
            >
              <td>
                <Image src={lesson.lessonImage} thumbnail style={{ width: "100px" }} />
              </td>
              <td>{lesson.lessonTitle}</td>
              <td>{lesson.level}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
```

**Giải thích theo yêu cầu:**

#### 1. "URL must be /rollnumber/completed-lessons"
```jsx
// src/routes/AppRoutes.jsx
{
  path: '/SE181834/completed-lessons',  // ✅ Đúng format
  element: <CompletedLessonsPage />,
}
```

#### 2. "display all lessons that are completed (isCompleted == true)"
```jsx
const completed = data.filter((lesson) => lesson.isCompleted);
```
- Filter ngược lại với HomePage
- Chỉ lấy lessons đã hoàn thành

#### 3. "Each item must show: lessonTitle, level, and lessonImage"
```jsx
<Image src={lesson.lessonImage} />  {/* lessonImage */}
<td>{lesson.lessonTitle}</td>       {/* lessonTitle */}
<td>{lesson.level}</td>             {/* level */}
```
- ✅ Có đủ 3 fields yêu cầu
- **Khác với Task 2.3:** Hiển thị image thay vì estimatedTime

#### 4. Tại sao dùng `<Image thumbnail>`?
```jsx
<Image src={lesson.lessonImage} thumbnail style={{ width: "100px" }} />
```
- **`thumbnail`**: Thêm border, rounded corners (Bootstrap style)
- **`width: "100px"`**: Fixed width để consistent
- **Visual appeal:** Đẹp hơn chỉ dùng `<img>`

---

## 📋 Task 3: Detail & CRUD

### Task 3.1 (1.0 mark): Lesson Detail Page

**Yêu cầu đề:**
> At the Lesson Detail route (URL must be /rollnumber/lessons/:id, e.g., /se123456/lessons/:id), display all the details of a lesson: lessonTitle, lessonImage, level, isCompleted, estimatedTime. The estimatedTime value must be formatted with comma separators for thousands (e.g., 1,200 minutes). Design and arrange this component in a visually pleasing and clear layout.

**Code Implementation:**

```jsx
// src/components/LessonDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import { Card, Spinner, Alert, ListGroup, Button } from "react-bootstrap";

export default function LessonDetailPage() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();  // ← Lấy :id từ URL
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
  }, [id]);  // Re-fetch khi ID thay đổi

  // YÊU CẦU: formatted with comma separators for thousands
  const formatTime = (time) => {
    return new Intl.NumberFormat().format(time);
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!lesson) return <Alert variant="warning">Lesson not found.</Alert>;

  return (
    <Card className="w-75 mx-auto">
      {/* YÊU CẦU: Display all details: lessonTitle */}
      <Card.Header as="h3">{lesson.lessonTitle}</Card.Header>
      
      {/* YÊU CẦU: lessonImage */}
      <Card.Img
        variant="top"
        src={lesson.lessonImage}
        style={{ maxHeight: "400px", objectFit: "cover" }}
      />
      
      <Card.Body>
        {/* YÊU CẦU: level, isCompleted, estimatedTime */}
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Level:</strong> {lesson.level}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Status:</strong>{" "}
            {lesson.isCompleted ? "Completed" : "Not Completed"}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Estimated Time:</strong>{" "}
            {formatTime(lesson.estimatedTime)} minutes
          </ListGroup.Item>
        </ListGroup>
        
        <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">
          Back to list
        </Button>
      </Card.Body>
    </Card>
  );
}
```

**Giải thích từng yêu cầu:**

#### 1. "URL must be /rollnumber/lessons/:id"
```jsx
// src/routes/AppRoutes.jsx
{
  path: '/SE181834/lessons/:id',  // ✅ Đúng format với dynamic param
  element: <LessonDetailPage />,
}
```
- **`:id`**: Dynamic route parameter
- Ví dụ: `/SE181834/lessons/1`, `/SE181834/lessons/2`

#### 2. Tại sao cần `useParams()`?
```jsx
const { id } = useParams();
```
- **`useParams()`**: Hook của React Router để lấy URL params
- **`id`**: Match với `:id` trong route definition
- Dùng để fetch đúng lesson: `get(`/${id}`)`

#### 3. "display all the details of a lesson: lessonTitle, lessonImage, level, isCompleted, estimatedTime"
```jsx
<Card.Header>{lesson.lessonTitle}</Card.Header>  {/* lessonTitle */}
<Card.Img src={lesson.lessonImage} />            {/* lessonImage */}
<strong>Level:</strong> {lesson.level}           {/* level */}
<strong>Status:</strong> {lesson.isCompleted ? "Completed" : "Not Completed"}  {/* isCompleted */}
<strong>Estimated Time:</strong> {formatTime(lesson.estimatedTime)}  {/* estimatedTime */}
```
- ✅ Có đủ 5 fields yêu cầu

#### 4. "The estimatedTime value must be formatted with comma separators for thousands (e.g., 1,200 minutes)"
```jsx
const formatTime = (time) => {
  return new Intl.NumberFormat().format(time);
};
```
- **`Intl.NumberFormat()`**: Built-in JavaScript API
- **Automatic formatting:**
  - `1200` → `1,200`
  - `45000` → `45,000`
- **Locale-aware:** Tự động theo locale của browser

**Tại sao không dùng `.toLocaleString()`?**
```jsx
// Cách khác (cũng được):
lesson.estimatedTime.toLocaleString()
```
- Cả 2 cách đều OK
- `Intl.NumberFormat()` flexible hơn cho advanced formatting

#### 5. "Design and arrange this component in a visually pleasing and clear layout"
```jsx
<Card className="w-75 mx-auto">  {/* Center card, 75% width */}
  <Card.Header as="h3">...</Card.Header>  {/* Header với title */}
  <Card.Img style={{ maxHeight: "400px", objectFit: "cover" }} />  {/* Image */}
  <Card.Body>
    <ListGroup variant="flush">  {/* Clean list của details */}
      <ListGroup.Item>...</ListGroup.Item>
    </ListGroup>
  </Card.Body>
</Card>
```

**Design decisions:**
- **Card layout**: Clean, professional
- **`w-75 mx-auto`**: Center card, không full width
- **`maxHeight: "400px"`**: Prevent image quá lớn
- **`objectFit: "cover"`**: Maintain aspect ratio
- **ListGroup**: Organized key-value pairs
- **`variant="flush"`**: No borders, cleaner look

---

### Task 3.2 (1.5 marks): Add Lesson Form

**Yêu cầu đề:**
> Create an Add Lesson route with the requirements:
> - The form must validate all inputs.
> - ✓ All fields are required.
> - ✓ lessonTitle must contain more than 1 word (e.g., "Kanji Master").
> - ✓ lessonImage must be a valid URL.
> - ✓ estimatedTime must be a number.
> - ✓ isCompleted is a switch control, set to false by default.
> - ✓ level is a select box with these 5 options: N1, N2, N3, N4, N5.

**Code Implementation:**

```jsx
// src/components/AddLessonPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form, Button, Spinner, Alert, FormCheck } from "react-bootstrap";
import { get, post, put } from "../api/apiCaller";

// YÊU CẦU: The form must validate all inputs
const validationSchema = Yup.object().shape({
  // YÊU CẦU: lessonTitle must contain more than 1 word
  lessonTitle: Yup.string()
    .trim()
    .matches(/(\s)/, "Must contain more than 1 word")
    .required("Lesson Title is required"),

  // YÊU CẦU: lessonImage must be a valid URL
  lessonImage: Yup.string()
    .url("Must be a valid URL")
    .required("Lesson Image is required"),

  // YÊU CẦU: All fields are required
  level: Yup.string().required("Level is required"),

  // YÊU CẦU: estimatedTime must be a number
  estimatedTime: Yup.number()
    .typeError("Must be a number")
    .required("Estimated Time is required"),

  // YÊU CẦU: isCompleted is a switch control
  isCompleted: Yup.boolean(),
});

export default function AddLessonPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);  // Edit mode nếu có ID

  // YÊU CẦU: isCompleted set to false by default
  const [initialValues, setInitialValues] = useState({
    lessonTitle: "",
    lessonImage: "",
    level: "N5",
    estimatedTime: "",
    isCompleted: false,  // ← Default false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Task 3.4: Load data nếu Edit mode
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

  if (loading) return <Spinner />;

  return (
    <div className="w-75 mx-auto">
      <h2 className="mb-4">{isEditMode ? "Edit Lesson" : "Add New Lesson"}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize  // Important cho Edit mode
      >
        {({ isSubmitting }) => (
          <FormikForm>
            {/* YÊU CẦU: lessonTitle field */}
            <Form.Group className="mb-3">
              <Form.Label>Lesson Title</Form.Label>
              <Field type="text" name="lessonTitle" as={Form.Control} />
              <ErrorMessage name="lessonTitle" component={Form.Text} className="text-danger" />
            </Form.Group>

            {/* YÊU CẦU: lessonImage field */}
            <Form.Group className="mb-3">
              <Form.Label>Lesson Image URL</Form.Label>
              <Field type="text" name="lessonImage" as={Form.Control} />
              <ErrorMessage name="lessonImage" component={Form.Text} className="text-danger" />
            </Form.Group>

            {/* YÊU CẦU: level is a select box with 5 options */}
            <Form.Group className="mb-3">
              <Form.Label>Level</Form.Label>
              <Field as={Form.Select} name="level">
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </Field>
              <ErrorMessage name="level" component={Form.Text} className="text-danger" />
            </Form.Group>

            {/* YÊU CẦU: estimatedTime field */}
            <Form.Group className="mb-3">
              <Form.Label>Estimated Time (minutes)</Form.Label>
              <Field type="text" name="estimatedTime" as={Form.Control} />
              <ErrorMessage name="estimatedTime" component={Form.Text} className="text-danger" />
            </Form.Group>

            {/* YÊU CẦU: isCompleted is a switch control */}
            <Form.Group className="mb-3">
              <Field as={FormCheck} type="switch" name="isCompleted" label="Is Completed?" />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner as="span" size="sm" /> : isEditMode ? "Update Lesson" : "Add Lesson"}
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)} className="ms-2">
              Cancel
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
```

**Giải thích từng yêu cầu validation:**

#### 1. "All fields are required"
```jsx
.required("Lesson Title is required")
.required("Lesson Image is required")
.required("Level is required")
.required("Estimated Time is required")
```
- Tất cả fields đều có `.required()`
- ✅ Đáp ứng yêu cầu

#### 2. "lessonTitle must contain more than 1 word (e.g., 'Kanji Master')"
```jsx
lessonTitle: Yup.string()
  .trim()
  .matches(/(\s)/, "Must contain more than 1 word")
  .required("Lesson Title is required"),
```

**Giải thích chi tiết:**
- **`.trim()`**: Xóa spaces đầu/cuối trước khi validate
- **`.matches(/(\s)/)`**: Regex check có ít nhất 1 space (whitespace)
- **Logic:** Nếu có space → có ít nhất 2 từ
- **Examples:**
  - ✅ `"Kanji Master"` → Pass (có space)
  - ✅ `"Basic Japanese Grammar"` → Pass
  - ❌ `"Kanji"` → Fail (không có space)
  - ❌ `"   "` → Fail (trim thành empty)

**Tại sao không dùng `.split(' ').length >= 2`?**
- Yup không hỗ trợ custom logic phức tạp trong schema
- Regex đơn giản và hiệu quả hơn

#### 3. "lessonImage must be a valid URL"
```jsx
lessonImage: Yup.string()
  .url("Must be a valid URL")
  .required("Lesson Image is required"),
```
- **`.url()`**: Built-in Yup validator
- Check format: `http://...` hoặc `https://...`
- **Examples:**
  - ✅ `"https://example.com/image.jpg"` → Pass
  - ✅ `"http://picsum.photos/400/300"` → Pass
  - ❌ `"not-a-url"` → Fail
  - ❌ `"www.example.com"` → Fail (cần http:// hoặc https://)

#### 4. "estimatedTime must be a number"
```jsx
estimatedTime: Yup.number()
  .typeError("Must be a number")
  .required("Estimated Time is required"),
```
- **`.number()`**: Check type là number
- **`.typeError()`**: Custom error message khi type wrong
- **Examples:**
  - ✅ `1200` → Pass
  - ✅ `"1200"` → Pass (Yup auto-convert string to number)
  - ❌ `"abc"` → Fail ("Must be a number")
  - ❌ Empty → Fail ("Estimated Time is required")

#### 5. "isCompleted is a switch control, set to false by default"
```jsx
// Validation
isCompleted: Yup.boolean(),

// Initial value
const [initialValues, setInitialValues] = useState({
  isCompleted: false,  // ← Default false
});

// UI
<Field as={FormCheck} type="switch" name="isCompleted" label="Is Completed?" />
```

**3 parts của requirement:**
- ✅ **"switch control"**: `type="switch"` (toggle switch UI)
- ✅ **"set to false by default"**: `isCompleted: false` trong initialValues
- ✅ **Validation**: `Yup.boolean()` (optional, vì switch luôn boolean)

**Tại sao dùng switch thay vì checkbox?**
- Switch = modern UI, more intuitive
- Clear visual: ON/OFF

#### 6. "level is a select box with these 5 options: N1, N2, N3, N4, N5"
```jsx
<Field as={Form.Select} name="level">
  <option value="N5">N5</option>
  <option value="N4">N4</option>
  <option value="N3">N3</option>
  <option value="N2">N2</option>
  <option value="N1">N1</option>
</Field>
```
- ✅ **"select box"**: `<Form.Select>` = dropdown
- ✅ **"5 options"**: Đúng 5 options
- ✅ **"N1, N2, N3, N4, N5"**: Đúng values

**Tại sao thứ tự N5 → N1?**
- N5 = beginner, N1 = advanced
- Logical ordering từ dễ → khó

---

### Task 3.3 (0.75 mark): Delete Function

**Yêu cầu đề:**
> At the All Lessons route, implement the delete function: You must show a confirmation prompt before deleting. After successful deletion, show a notification (modal, alert, toast, etc.). Reload the lesson list.

**Code đã implement trong AllLessonsPage.jsx:**

```jsx
const handleDelete = async (e, id) => {
  e.stopPropagation();
  
  // YÊU CẦU: show a confirmation prompt before deleting
  const isConfirmed = window.confirm("Are you sure you want to delete this lesson?");
  
  if (isConfirmed) {
    try {
      await remove(`/${id}`);
      
      // YÊU CẦU: show a notification after successful deletion
      alert("Lesson deleted successfully!");
      
      // YÊU CẦU: Reload the lesson list
      fetchLessons();
    } catch (err) {
      alert(`Error deleting lesson: ${err.message}`);
    }
  }
};
```

**Giải thích từng yêu cầu:**

#### 1. "You must show a confirmation prompt before deleting"
```jsx
const isConfirmed = window.confirm("Are you sure you want to delete this lesson?");

if (isConfirmed) {
  // Only delete if user confirms
}
```
- **`window.confirm()`**: Built-in browser dialog
- **Returns:** `true` nếu user click OK, `false` nếu Cancel
- **UX safety:** Prevent accidental deletion

**Tại sao không validate confirm == "yes"?**
- `confirm()` trả về boolean, không phải string
- Không cần check string

#### 2. "After successful deletion, show a notification (modal, alert, toast, etc.)"
```jsx
alert("Lesson deleted successfully!");
```

**3 options đề bài cho:**
- ✅ **Alert**: `alert()` - đơn giản nhất
- ⚡ **Toast**: React Bootstrap Toast - modern hơn (như trong code hiện tại)
- 🎨 **Modal**: React Bootstrap Modal - fancy nhất

**Code với Toast (better UX):**
```jsx
// State
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastVariant, setToastVariant] = useState("success");

// Handler
await remove(`/${id}`);
setToastMessage("Lesson deleted successfully!");
setToastVariant("success");
setShowToast(true);

// UI
<ToastContainer position="top-end">
  <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
    <Toast.Header>
      <strong>{toastVariant === "success" ? "Success" : "Error"}</strong>
    </Toast.Header>
    <Toast.Body>{toastMessage}</Toast.Body>
  </Toast>
</ToastContainer>
```

**So sánh Alert vs Toast:**

| Feature | Alert | Toast |
|---------|-------|-------|
| Block UI | ✅ Yes | ❌ No |
| Auto-hide | ❌ No | ✅ Yes |
| Custom styling | ❌ No | ✅ Yes |
| Professional | ❌ Basic | ✅ Modern |

**Recommendation:** Dùng Toast cho better UX

#### 3. "Reload the lesson list"
```jsx
fetchLessons();
```
- Call lại function fetch data
- Update UI với list mới (không còn lesson đã xóa)
- **Tại sao cần reload?** Để sync UI với backend

**Tại sao không dùng local state update?**
```jsx
// Cách 1: Reload từ API (recommended)
fetchLessons();

// Cách 2: Update local state (not recommended)
setLessons(lessons.filter(l => l.id !== id));
```
- **Cách 1:** Đảm bảo data sync với backend
- **Cách 2:** Faster, nhưng có risk nếu API fail
- **Best practice:** Always reload từ API sau mutation

---

### Task 3.4 (1.25 marks): Update Function

**Yêu cầu đề:**
> At the All Lessons route, implement the update a Lesson function: Clicking the Edit button must navigate to the update form. The form must follow the same validation rules as the Add Lesson form in Task 3.2.

**Code đã implement:**

#### 1. Edit Button trong AllLessonsPage:
```jsx
const handleEdit = (e, id) => {
  e.stopPropagation();
  // YÊU CẦU: navigate to the update form
  navigate(`/SE181834/edit-lesson/${id}`);
};

<Button variant="warning" size="sm" onClick={(e) => handleEdit(e, lesson.id)}>
  Edit
</Button>
```

#### 2. Route Configuration:
```jsx
// src/routes/AppRoutes.jsx
{
  path: '/SE181834/edit-lesson/:id',
  element: <AddLessonPage />,  // ← Dùng chung component
}
```

#### 3. AddLessonPage xử lý cả Add và Edit:
```jsx
export default function AddLessonPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);  // Check có ID = Edit mode

  // YÊU CẦU: The form must follow the same validation rules
  // ← Dùng chung validationSchema

  useEffect(() => {
    if (isEditMode) {
      // Load data cũ để pre-populate form
      get(`/${id}`)
        .then((data) => {
          setInitialValues(data);
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (isEditMode) {
      // Update existing lesson
      await put(`/${id}`, values);
      alert("Lesson updated successfully!");
    } else {
      // Create new lesson
      await post("/", values);
      alert("Lesson added successfully!");
    }
    navigate("/SE181834/all-lessons");
  };

  return (
    <div>
      <h2>{isEditMode ? "Edit Lesson" : "Add New Lesson"}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}  // ← Same validation
        onSubmit={handleSubmit}
        enableReinitialize  // ← Important!
      >
        {/* Same form fields */}
      </Formik>
    </div>
  );
}
```

**Giải thích từng yêu cầu:**

#### 1. "Clicking the Edit button must navigate to the update form"
```jsx
navigate(`/SE181834/edit-lesson/${id}`);
```
- Click Edit → Navigate đến `/SE181834/edit-lesson/1` (example)
- URL có ID → AddLessonPage biết là Edit mode

#### 2. "The form must follow the same validation rules as the Add Lesson form"
```jsx
const validationSchema = Yup.object().shape({
  // Same validation cho cả Add và Edit
});

<Formik validationSchema={validationSchema}>
```
- ✅ Dùng chung `validationSchema`
- Không cần duplicate validation logic

#### 3. Tại sao dùng chung component cho Add và Edit?
**Lợi ích:**
- ✅ **DRY:** Không duplicate code
- ✅ **Maintainability:** Sửa 1 chỗ, apply cho cả 2
- ✅ **Consistency:** UI và validation giống nhau

**Phân biệt Add vs Edit:**
```jsx
const { id } = useParams();
const isEditMode = Boolean(id);  // true nếu có ID, false nếu không
```

**Pattern này gọi là:** "Conditional Component Behavior"

#### 4. Tại sao cần `enableReinitialize`?
```jsx
<Formik
  initialValues={initialValues}
  enableReinitialize  // ← Without this, form won't update
>
```

**Vấn đề không có `enableReinitialize`:**
1. User click Edit button
2. Navigate đến edit page
3. `useEffect` fetch data và `setInitialValues(data)`
4. ❌ Form vẫn empty vì Formik đã initialize với empty values

**Với `enableReinitialize`:**
1. User click Edit button
2. Navigate đến edit page
3. `useEffect` fetch data và `setInitialValues(data)`
4. ✅ Formik detect `initialValues` changed → re-initialize form
5. ✅ Form hiển thị data cũ

**Key point:** `enableReinitialize` là MUST-HAVE cho Edit mode

#### 5. PUT vs POST API call
```jsx
if (isEditMode) {
  await put(`/${id}`, values);  // Update existing
} else {
  await post("/", values);      // Create new
}
```
- **PUT:** Update existing resource
- **POST:** Create new resource
- **RESTful convention**

---

## 📊 Checklist Hoàn Thành

### Task 1: Setup (0.5 mark)
- [x] Create resource trên MockAPI với roll number
- [x] Define schema đầy đủ 6 fields
- [x] Import data từ jlpt_lessons.json
- [x] Tạo file .env với API URL

### Task 2: Navigation & Pages (5.0 marks)

#### Task 2.1 (1.0 mark): Navbar
- [x] Navbar có 3 links: Home, All Lessons, Completed Lessons
- [x] Dùng React Router DOM
- [x] Responsive navbar

#### Task 2.2 (2.0 marks): Home Page
- [x] Hiển thị lessons chưa hoàn thành (`isCompleted == false`)
- [x] Grid layout responsive
- [x] Card hiển thị: lessonTitle, lessonImage, level, estimatedTime
- [x] Click image → navigate Detail page

#### Task 2.3 (1.0 mark): All Lessons Page
- [x] URL: `/rollnumber/all-lessons`
- [x] List layout (Table)
- [x] Hiển thị: lessonTitle, level, estimatedTime
- [x] Có nút Edit và Delete
- [x] Sort descending by ID
- [x] Click row → navigate Detail page

#### Task 2.4 (1.0 mark): Completed Lessons Page
- [x] URL: `/rollnumber/completed-lessons`
- [x] Hiển thị lessons đã hoàn thành (`isCompleted == true`)
- [x] List layout
- [x] Hiển thị: lessonTitle, level, lessonImage
- [x] Sort descending by ID
- [x] Click row → navigate Detail page

### Task 3: Detail & CRUD (4.5 marks)

#### Task 3.1 (1.0 mark): Lesson Detail
- [x] URL: `/rollnumber/lessons/:id`
- [x] Hiển thị đầy đủ: lessonTitle, lessonImage, level, isCompleted, estimatedTime
- [x] Format estimatedTime với comma separator
- [x] Layout đẹp và rõ ràng

#### Task 3.2 (1.5 marks): Add Lesson
- [x] Form validate tất cả inputs
- [x] All fields required
- [x] lessonTitle > 1 word
- [x] lessonImage valid URL
- [x] estimatedTime is number
- [x] isCompleted switch, default false
- [x] level select với 5 options: N1-N5

#### Task 3.3 (0.75 mark): Delete Function
- [x] Confirmation prompt trước khi xóa
- [x] Notification sau khi xóa thành công
- [x] Reload lesson list

#### Task 3.4 (1.25 marks): Update Function
- [x] Click Edit → navigate update form
- [x] Form follow same validation rules
- [x] Pre-populate data cũ
- [x] Update successfully

---

## 🎯 Tips & Best Practices

### 1. Đọc Kỹ Đề Bài
- ⚠️ **URL format:** Phải đúng `/rollnumber/...`
- ⚠️ **Fields:** Phải hiển thị đúng fields yêu cầu
- ⚠️ **Validation:** Đọc kỹ rules
- ⚠️ **.env file:** MUST use để lưu API URL

### 2. Testing
```bash
# Test từng task
1. Navbar: Click tất cả links
2. Home: Check filter, grid layout, click image
3. All Lessons: Check sort, edit, delete
4. Completed: Check filter, sort
5. Detail: Check format, all fields
6. Add: Try invalid inputs, check validation
7. Edit: Pre-populate, update
```

### 3. Common Mistakes
❌ **Sai URL format:** `/all-lessons` thay vì `/SE181834/all-lessons`
❌ **Thiếu fields:** Không hiển thị đủ fields yêu cầu
❌ **Không validate:** Form không có validation
❌ **Không reload:** Sau delete không reload list
❌ **Không format time:** 1200 thay vì 1,200

### 4. Time Management (85 minutes)
- **0-10 min:** Setup project, install packages, create .env
- **10-15 min:** Setup MockAPI, import data
- **15-25 min:** Create Navbar + Routes
- **25-40 min:** Home Page + All Lessons Page
- **40-50 min:** Completed Page + Detail Page
- **50-65 min:** Add Lesson Form với validation
- **65-75 min:** Delete + Update functions
- **75-85 min:** Testing + fixing bugs

### 5. Kiểm Tra Cuối Cùng
```bash
# Run app
npm run dev

# Check list:
□ .env file exists với API URL
□ All routes work
□ Navbar links work
□ Home page hiển thị uncompleted lessons
□ All Lessons có Edit/Delete buttons
□ Completed Lessons filter đúng
□ Detail page format time đúng
□ Add form validate tất cả fields
□ Edit form pre-populate data
□ Delete có confirmation
□ No console errors
```

---

## 🚀 Final Notes

### Điểm Cần Nhớ

1. **URL Format là Critical**
   - Phải có roll number: `/SE181834/...`
   - Sai URL = mất điểm

2. **Validation Rules Phải Đúng**
   - lessonTitle > 1 word (có space)
   - lessonImage valid URL
   - estimatedTime number
   - All fields required

3. **UI/UX Matters**
   - Responsive design
   - Loading states
   - Error handling
   - Clear layouts

4. **.env File là Bắt Buộc**
   - Không dùng .env = 0 điểm
   - Store API URL properly

5. **Testing Thoroughly**
   - Test all routes
   - Test all CRUD operations
   - Test validation
   - Test edge cases

### Resources
- React Router: https://reactrouter.com
- React Bootstrap: https://react-bootstrap.github.io
- Formik: https://formik.org
- Yup: https://github.com/jquense/yup
- MockAPI: https://mockapi.io

---

**Good luck với PE exam! 🎉**

Nhớ đọc kỹ đề, follow checklist, và test kỹ trước khi submit!
