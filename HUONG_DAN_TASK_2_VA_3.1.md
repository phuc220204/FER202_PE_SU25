# 📚 HƯỚNG DẪN CHI TIẾT: TASK 2 VÀ TASK 3.1

**Mã đề:** PE_FER202_20250708  
**Môn học:** FER202  
**Thời gian:** 85 phút

---

## 🎯 MỤC LỤC

1. [Tổng quan và Nguyên tắc](#1-tổng-quan-và-nguyên-tắc)
2. [Bước 0: Setup Dự án](#2-bước-0-setup-dự-án)
3. [Task 1: Tạo Resource và Data (0.5 mark)](#3-task-1-tạo-resource-và-data-05-mark)
4. [Task 2: Navigation và Hiển thị (5.0 marks)](#4-task-2-navigation-và-hiển-thị-50-marks)
5. [Task 3.1: Lesson Detail Page (1.0 mark)](#5-task-31-lesson-detail-page-10-mark)

---

## 1. TỔNG QUAN VÀ NGUYÊN TẮC

### ⚠️ **NGUYÊN TẮC BẮT BUỘC (TUYỆT ĐỐI KHÔNG VI PHẠM):**

1. ❌ **KHÔNG** được sử dụng thiết bị để chia sẻ dữ liệu
2. ✅ **PHẢI** sử dụng **Visual Studio Code** làm IDE
3. ❌ Code không liên quan → **0 điểm**
4. ❌ **KHÔNG** dùng `.env` để lưu API URL → **0 điểm**
5. ✅ Tên thư mục app = **roll number** của bạn (ví dụ: `se181834`)

### 📊 **Cấu trúc Data JSON:**

Mỗi lesson có cấu trúc:
```json
{
  "id": "1",
  "lessonTitle": "Japanese Sentence Patterns for JLPT N5",
  "lessonImage": "https://m.media-amazon.com/images/I/81gfrrHoS3L._SY466_.jpg",
  "level": "N5",
  "isCompleted": false,
  "estimatedTime": 4500
}
```

**Lưu ý:** `estimatedTime` trong data là **số giây**, nhưng hiển thị phải là **phút** (chia 60).

---

## 2. BƯỚC 0: SETUP DỰ ÁN

### 2.1. Tạo React App

```bash
# Cách 1: Vite (khuyến nghị - nhanh hơn)
npm create vite@latest se181834 -- --template react
cd se181834
npm install

# Cách 2: Create React App
npx create-react-app se181834
cd se181834
```

**⚠️ QUAN TRỌNG:** Thay `se181834` bằng **roll number của bạn** (viết thường).

### 2.2. Cài đặt Dependencies

```bash
npm install react-router-dom react-bootstrap bootstrap axios
```

**Giải thích:**
- `react-router-dom`: Routing
- `react-bootstrap` + `bootstrap`: UI components
- `axios`: HTTP client

### 2.3. Import Bootstrap CSS

**File:** `src/main.jsx` (Vite) hoặc `src/index.js` (CRA)

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

### 2.4. Tạo file `.env`

**File:** `.env` (ở thư mục gốc)

```env
# API
VITE_API_URL=https://6907b85fb1879c890eda8b1b.mockapi.io/se181834
```

**⚠️ QUAN TRỌNG:**
- Thay `se181834` bằng roll number của bạn
- Với CRA: dùng `REACT_APP_API_URL` thay vì `VITE_API_URL`

### 2.5. Tạo cấu trúc thư mục

```
src/
├── api/
│   └── apiCaller.js
├── components/
│   ├── Navbar.jsx
│   ├── HomePage.jsx
│   ├── AllLessonsPage.jsx
│   ├── CompletedLessonsPage.jsx
│   └── LessonDetailPage.jsx
├── layouts/
│   └── MainLayout.jsx
├── routes/
│   └── AppRoutes.jsx
├── App.jsx
└── main.jsx
```

### 2.6. Tạo API Caller

**File:** `src/api/apiCaller.js`

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Vite
  // baseURL: process.env.REACT_APP_API_URL, // CRA
});

const request = async (
  method,
  endpoint,
  { body = {}, params = {}, headers = {} } = {}
) => {
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

export default api;
```

---

## 3. TASK 1: TẠO RESOURCE VÀ DATA (0.5 MARK)

### 3.1. Tạo Resource trên mockapi.io (0.25 mark)

1. Truy cập: https://mockapi.io
2. Đăng nhập/Đăng ký
3. Tạo Project mới
4. Click **"New Resource"**
5. Đặt tên resource = **roll number của bạn** (ví dụ: `se181834`)
6. Thêm các fields:
   - `id`: String (auto-generated)
   - `lessonTitle`: String
   - `lessonImage`: String
   - `level`: String
   - `isCompleted`: Boolean
   - `estimatedTime`: Number

### 3.2. Copy Data vào Resource (0.25 mark)

1. Trên trang resource, tìm nút **"Bulk Insert"** hoặc **"Import"**
2. Copy toàn bộ JSON data sau và paste vào:

```json
[
  {
    "id": "1",
    "lessonTitle": "Japanese Sentence Patterns for JLPT N5",
    "lessonImage": "https://m.media-amazon.com/images/I/81gfrrHoS3L._SY466_.jpg",
    "level": "N5",
    "isCompleted": false,
    "estimatedTime": 4500
  },
  {
    "id": "2",
    "lessonTitle": "Japanese Kanji Made Easy",
    "lessonImage": "https://m.media-amazon.com/images/I/71LR2H4NUbL._SY385_.jpg",
    "level": "N5",
    "isCompleted": false,
    "estimatedTime": 4000
  },
  {
    "id": "3",
    "lessonTitle": "MASTER LISTENING JAPANESE LANGUAGE PROFICIENCY TEST N4",
    "lessonImage": "https://m.media-amazon.com/images/I/71WT2ufrDDL._SY425_.jpg",
    "level": "N4",
    "isCompleted": true,
    "estimatedTime": 6000
  },
  {
    "id": "4",
    "lessonTitle": "1500 JAPANESE VOCABULARY WORDS FOR THE JLPT LEVEL 4",
    "lessonImage": "https://m.media-amazon.com/images/I/71TQ+dI3qjL._SY466_.jpg",
    "level": "N4",
    "isCompleted": true,
    "estimatedTime": 5500
  },
  {
    "id": "5",
    "lessonTitle": "SHIN NIHONGO 500 MON - JLPT N3",
    "lessonImage": "https://m.media-amazon.com/images/I/71YP7MMykNL._SY466_.jpg",
    "level": "N3",
    "isCompleted": true,
    "estimatedTime": 7000
  },
  {
    "id": "6",
    "lessonTitle": "Try! Japanese Language Proficiency Test N3",
    "lessonImage": "https://m.media-amazon.com/images/I/710wWXgaHcL._SY425_.jpg",
    "level": "N3",
    "isCompleted": false,
    "estimatedTime": 5000
  },
  {
    "id": "7",
    "lessonTitle": "2500 Essential Vocabulary for the Jlpt N2",
    "lessonImage": "https://m.media-amazon.com/images/I/710hokXlHCL._SY466_.jpg",
    "level": "N2",
    "isCompleted": false,
    "estimatedTime": 6500
  },
  {
    "id": "8",
    "lessonTitle": "Quick Mastery of Jlpt N2 Grammar: The Workbook for the Japanese Language Proficiency Test",
    "lessonImage": "https://m.media-amazon.com/images/I/81QKH-w3JfL._SY425_.jpg",
    "level": "N2",
    "isCompleted": false,
    "estimatedTime": 7500
  },
  {
    "id": "9",
    "lessonTitle": "KANZEN MASTER GRAMMAR JAPANESE LANGUAGE PROFICIENCY TEST JLPT N1",
    "lessonImage": "https://m.media-amazon.com/images/I/91yErlDaDjL._SY425_.jpg",
    "level": "N1",
    "isCompleted": true,
    "estimatedTime": 9000
  },
  {
    "id": "10",
    "lessonTitle": "Jlpt N1 Japanese Lauguage Proficiency Test Trial Examination",
    "lessonImage": "https://m.media-amazon.com/images/I/71Crqtp65IL._SY425_.jpg",
    "level": "N1",
    "isCompleted": false,
    "estimatedTime": 8500
  }
]
```

3. Xác nhận để import data

---

## 4. TASK 2: NAVIGATION VÀ HIỂN THỊ (5.0 MARKS)

### 4.1. Setup Router

**File:** `src/App.jsx`

```javascript
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import getRoutes from "./routes/AppRoutes";

function App() {
  const routes = getRoutes();
  const element = useRoutes(routes);
  return element;
}

export default App;
```

**File:** `src/routes/AppRoutes.jsx`

```javascript
import MainLayout from "../layouts/MainLayout";
import HomePage from "../components/HomePage";
import AllLessonsPage from "../components/AllLessonsPage";
import CompletedLessonsPage from "../components/CompletedLessonsPage";
import LessonDetailPage from "../components/LessonDetailPage";

const routes = () => [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/se181834/all-lessons",
        element: <AllLessonsPage />,
      },
      {
        path: "/se181834/completed-lessons",
        element: <CompletedLessonsPage />,
      },
      {
        path: "/se181834/lessons/:id",
        element: <LessonDetailPage />,
      },
    ],
  },
];

export default routes;
```

**File:** `src/layouts/MainLayout.jsx`

```javascript
import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import AppNavbar from "../components/Navbar";

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

### 4.2. Task 2.1: Navbar (1.0 mark)

**File:** `src/components/Navbar.jsx`

```javascript
import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function AppNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          SE181834
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/se181834/all-lessons">
              All Lessons
            </Nav.Link>
            <Nav.Link as={Link} to="/se181834/completed-lessons">
              Completed Lessons
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
```

**✅ Yêu cầu đã đáp ứng:**
- ✅ Navbar có 3 links: Home, All Lessons, Completed Lessons
- ✅ Sử dụng react-router-dom
- ✅ Responsive với hamburger menu trên mobile

### 4.3. Task 2.2: Home Page (2.0 marks)

**File:** `src/components/HomePage.jsx`

```javascript
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
        // Filter chỉ lấy lessons chưa hoàn thành
        const uncompleted = data.filter((lesson) => !lesson.isCompleted);
        setLessons(uncompleted);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const handleImageClick = (id) => {
    navigate(`/se181834/lessons/${id}`);
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
                    <strong>Time:</strong> {Math.round(lesson.estimatedTime / 60)} minutes
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
```

**✅ Yêu cầu đã đáp ứng:**
- ✅ Hiển thị `isCompleted == false`
- ✅ Grid layout (Row/Col với xs={1} md={2} lg={3})
- ✅ Mỗi card: lessonTitle, lessonImage, level, estimatedTime (phút)
- ✅ Click image → navigate đến Detail page

### 4.4. Task 2.3: All Lessons Page (1.0 mark)

**File:** `src/components/AllLessonsPage.jsx`

```javascript
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../api/apiCaller";
import {
  Table,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

export default function AllLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await get("/");
      // Sort descending theo id
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

  const handleItemClick = (id) => {
    navigate(`/se181834/lessons/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    // Chức năng Edit sẽ được implement ở Task 3.4
    console.log("Edit lesson:", id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    // Chức năng Delete sẽ được implement ở Task 3.3
    console.log("Delete lesson:", id);
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
      <h2 className="mb-4">All Lessons</h2>
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
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <tr
                key={lesson.id}
                onClick={() => handleItemClick(lesson.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{lesson.id}</td>
                <td>{lesson.lessonTitle}</td>
                <td>{lesson.level}</td>
                <td>{Math.round(lesson.estimatedTime / 60)}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={(e) => handleEdit(e, lesson.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={(e) => handleDelete(e, lesson.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No lessons found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
```

**✅ Yêu cầu đã đáp ứng:**
- ✅ URL: `/se181834/all-lessons`
- ✅ List layout (Table)
- ✅ Hiển thị: lessonTitle, level, estimatedTime
- ✅ Edit và Delete buttons (chưa có chức năng, sẽ implement ở Task 3)
- ✅ Sort descending theo id
- ✅ Click row → navigate đến Detail page

### 4.5. Task 2.4: Completed Lessons Page (1.0 mark)

**File:** `src/components/CompletedLessonsPage.jsx`

```javascript
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
        // Filter completed lessons
        const completed = data.filter((lesson) => lesson.isCompleted);
        // Sort descending theo id
        const sortedData = completed.sort(
          (a, b) => parseInt(b.id) - parseInt(a.id)
        );
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

  const handleItemClick = (id) => {
    navigate(`/se181834/lessons/${id}`);
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
      <h2 className="mb-4">Completed Lessons</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Lesson Title</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <tr
                key={lesson.id}
                onClick={() => handleItemClick(lesson.id)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <Image
                    src={lesson.lessonImage}
                    alt={lesson.lessonTitle}
                    thumbnail
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>{lesson.lessonTitle}</td>
                <td>{lesson.level}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No completed lessons found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
```

**✅ Yêu cầu đã đáp ứng:**
- ✅ URL: `/se181834/completed-lessons`
- ✅ Filter `isCompleted == true`
- ✅ List layout (Table)
- ✅ Hiển thị: lessonTitle, level, lessonImage
- ✅ Sort descending theo id
- ✅ Click row → navigate đến Detail page

---

## 5. TASK 3.1: LESSON DETAIL PAGE (1.0 MARK)

**File:** `src/components/LessonDetailPage.jsx`

```javascript
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
    // estimatedTime là giây, chuyển sang phút và format với comma
    const minutes = Math.round(time / 60);
    return new Intl.NumberFormat().format(minutes);
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
```

**✅ Yêu cầu đã đáp ứng:**
- ✅ URL: `/se181834/lessons/:id`
- ✅ Hiển thị đủ: lessonTitle, lessonImage, level, isCompleted, estimatedTime
- ✅ Format estimatedTime với comma (ví dụ: 1,200 minutes)
- ✅ Layout đẹp và rõ ràng (Card component)

**Giải thích code:**

1. **useParams()**: Lấy `id` từ URL (`/se181834/lessons/:id`)
2. **useEffect**: Fetch data khi component mount hoặc khi `id` thay đổi
3. **formatTime()**: 
   - Chuyển giây sang phút: `Math.round(time / 60)`
   - Format với comma: `new Intl.NumberFormat().format(minutes)`
4. **Loading/Error states**: Hiển thị Spinner hoặc Alert khi cần
5. **Card layout**: Sử dụng Card component để layout đẹp

---

## 📋 TÓM TẮT CÁC TASK ĐÃ HOÀN THÀNH

### ✅ **Task 1 (0.5 mark):**
- ✅ Tạo resource trên mockapi.io
- ✅ Copy data JSON vào resource

### ✅ **Task 2 (5.0 marks):**
- ✅ Task 2.1: Navbar với 3 links
- ✅ Task 2.2: Home page - grid layout, uncompleted lessons
- ✅ Task 2.3: All Lessons page - list layout, sort desc, Edit/Delete buttons
- ✅ Task 2.4: Completed Lessons page - list layout, sort desc

### ✅ **Task 3.1 (1.0 mark):**
- ✅ Lesson Detail page - hiển thị đầy đủ thông tin, format time với comma

---

## 💡 LƯU Ý QUAN TRỌNG

1. **Roll Number:** Mã số sinh viên `se181834` đã được hard code trực tiếp trong tất cả các file. Nếu bạn cần thay đổi, hãy tìm và thay thế tất cả các chỗ có `se181834` trong code.

2. **URL Format:** Tất cả URL phải dùng chữ thường (ví dụ: `/se181834/all-lessons`)

3. **estimatedTime:** Data lưu là giây, hiển thị phải là phút (chia 60)

4. **Format Time:** Dùng `Intl.NumberFormat()` để format với comma

5. **Error Handling:** Luôn có try-catch và hiển thị error message

6. **Loading States:** Luôn hiển thị Spinner khi đang fetch data

---

## 🚀 CHECKLIST TRƯỚC KHI NỘP

1. ✅ Tất cả routes đúng format với roll number (chữ thường)
2. ✅ File `.env` có API URL
3. ✅ Không có code không liên quan
4. ✅ Loading và error states được xử lý
5. ✅ Format estimatedTime với comma
6. ✅ Sort descending theo id ở All Lessons và Completed Lessons
7. ✅ Click image/card/row navigate đúng đến Detail page
8. ✅ Navbar có đủ 3 links và hoạt động đúng

---

**Chúc bạn làm bài thi thành công! 🎉**

