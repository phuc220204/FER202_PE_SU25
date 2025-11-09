# 📚 HƯỚNG DẪN SỬ DỤNG BOOTSTRAP COMPONENTS

File này giải thích chi tiết các thẻ tag/components của React Bootstrap được sử dụng trong bài thi PE, bao gồm chức năng và cách sử dụng.

---

## 🎯 MỤC LỤC

1. [Layout Components](#1-layout-components)
2. [Navigation Components](#2-navigation-components)
3. [Card Components](#3-card-components)
4. [Table Components](#4-table-components)
5. [Form Components](#5-form-components)
6. [Button Components](#6-button-components)
7. [Feedback Components](#7-feedback-components)
8. [Image Components](#8-image-components)

---

## 1. LAYOUT COMPONENTS

### **Container**

**Chức năng:** Tạo container với max-width responsive, tự động căn giữa nội dung.

**Cách dùng:**
```javascript
import Container from "react-bootstrap/Container";

<Container className="mt-4">
  {/* Nội dung của bạn */}
</Container>
```

**Props quan trọng:**
- `fluid`: Làm container full-width (không có max-width)
- `className`: Thêm CSS classes

**Ví dụ trong code:**
```javascript
<Container className="mt-4">
  <Outlet />
</Container>
```

---

### **Row & Col (Grid System)**

**Chức năng:** Tạo grid layout responsive để sắp xếp các items theo cột.

**Cách dùng:**
```javascript
import { Row, Col } from "react-bootstrap";

<Row xs={1} md={2} lg={3} className="g-4">
  <Col>
    {/* Item 1 */}
  </Col>
  <Col>
    {/* Item 2 */}
  </Col>
</Row>
```

**Props quan trọng:**
- `xs={1}`: 1 cột trên màn hình rất nhỏ (mobile)
- `md={2}`: 2 cột trên màn hình trung bình (tablet)
- `lg={3}`: 3 cột trên màn hình lớn (desktop)
- `className="g-4"`: Gap (khoảng cách) giữa các cột = 1.5rem

**Ví dụ trong code:**
```javascript
<Row xs={1} md={2} lg={3} className="g-4">
  {lessons.map((lesson) => (
    <Col key={lesson.id}>
      <Card>...</Card>
    </Col>
  ))}
</Row>
```

**Giải thích:**
- Mobile: 1 cột (xs={1})
- Tablet: 2 cột (md={2})
- Desktop: 3 cột (lg={3})

---

## 2. NAVIGATION COMPONENTS

### **Navbar**

**Chức năng:** Tạo thanh navigation bar ở đầu trang.

**Cách dùng:**
```javascript
import Navbar from "react-bootstrap/Navbar";

<Navbar bg="dark" data-bs-theme="dark" expand="lg">
  {/* Nội dung navbar */}
</Navbar>
```

**Props quan trọng:**
- `bg`: Background color (`"dark"`, `"light"`, `"primary"`, etc.)
- `data-bs-theme`: Theme cho navbar (`"dark"` hoặc `"light"`)
- `expand`: Breakpoint để hiển thị menu (`"lg"` = large screen trở lên)

**Ví dụ trong code:**
```javascript
<Navbar bg="dark" data-bs-theme="dark" expand="lg">
  <Container>
    <Navbar.Brand>SE181834</Navbar.Brand>
    {/* ... */}
  </Container>
</Navbar>
```

---

### **Navbar.Brand**

**Chức năng:** Hiển thị logo/tên brand trong navbar.

**Cách dùng:**
```javascript
<Navbar.Brand as={Link} to="/">
  SE181834
</Navbar.Brand>
```

**Props quan trọng:**
- `as={Link}`: Render như một Link component (từ react-router-dom)
- `to="/"`: Đường dẫn khi click

**Ví dụ trong code:**
```javascript
<Navbar.Brand as={Link} to="/">
  SE181834
</Navbar.Brand>
```

---

### **Navbar.Toggle**

**Chức năng:** Nút hamburger menu để toggle menu trên mobile.

**Cách dùng:**
```javascript
<Navbar.Toggle aria-controls="basic-navbar-nav" />
```

**Props quan trọng:**
- `aria-controls`: ID của element được control (phải match với Navbar.Collapse id)

**Ví dụ trong code:**
```javascript
<Navbar.Toggle aria-controls="basic-navbar-nav" />
```

---

### **Navbar.Collapse**

**Chức năng:** Container chứa menu items, tự động collapse trên mobile.

**Cách dùng:**
```javascript
<Navbar.Collapse id="basic-navbar-nav">
  <Nav>
    {/* Menu items */}
  </Nav>
</Navbar.Collapse>
```

**Props quan trọng:**
- `id`: Phải match với `aria-controls` của Navbar.Toggle

**Ví dụ trong code:**
```javascript
<Navbar.Collapse id="basic-navbar-nav">
  <Nav className="me-auto">
    <Nav.Link as={Link} to="/">Home</Nav.Link>
  </Nav>
</Navbar.Collapse>
```

---

### **Nav**

**Chức năng:** Container chứa các navigation links.

**Cách dùng:**
```javascript
import Nav from "react-bootstrap/Nav";

<Nav className="me-auto">
  <Nav.Link>Home</Nav.Link>
</Nav>
```

**Props quan trọng:**
- `className="me-auto"`: Đẩy menu về bên trái (margin-end auto)

**Ví dụ trong code:**
```javascript
<Nav className="me-auto">
  <Nav.Link as={Link} to="/">Home</Nav.Link>
  <Nav.Link as={Link} to="/se181834/all-lessons">All Lessons</Nav.Link>
</Nav>
```

---

### **Nav.Link**

**Chức năng:** Một navigation link item.

**Cách dùng:**
```javascript
<Nav.Link as={Link} to="/">
  Home
</Nav.Link>
```

**Props quan trọng:**
- `as={Link}`: Render như Link component từ react-router-dom
- `to`: Đường dẫn

**Ví dụ trong code:**
```javascript
<Nav.Link as={Link} to="/se181834/all-lessons">
  All Lessons
</Nav.Link>
```

---

## 3. CARD COMPONENTS

### **Card**

**Chức năng:** Container để hiển thị nội dung dạng card.

**Cách dùng:**
```javascript
import { Card } from "react-bootstrap";

<Card className="h-100">
  <Card.Img src="..." />
  <Card.Body>
    <Card.Title>Title</Card.Title>
    <Card.Text>Content</Card.Text>
  </Card.Body>
</Card>
```

**Props quan trọng:**
- `className="h-100"`: Chiều cao 100% (để các card cùng chiều cao trong grid)

**Ví dụ trong code:**
```javascript
<Card className="h-100">
  <Card.Img variant="top" src={lesson.lessonImage} />
  <Card.Body>
    <Card.Title>{lesson.lessonTitle}</Card.Title>
  </Card.Body>
</Card>
```

---

### **Card.Img**

**Chức năng:** Hiển thị hình ảnh trong card.

**Cách dùng:**
```javascript
<Card.Img
  variant="top"
  src={lesson.lessonImage}
  alt="Description"
  style={{ cursor: "pointer" }}
/>
```

**Props quan trọng:**
- `variant="top"`: Đặt ảnh ở trên cùng của card
- `src`: URL của ảnh
- `alt`: Text mô tả ảnh (cho accessibility)
- `style`: Inline styles

**Ví dụ trong code:**
```javascript
<Card.Img
  variant="top"
  src={lesson.lessonImage}
  onClick={() => handleImageClick(lesson.id)}
  style={{ cursor: "pointer" }}
/>
```

---

### **Card.Body**

**Chức năng:** Container chứa nội dung chính của card.

**Cách dùng:**
```javascript
<Card.Body>
  <Card.Title>Title</Card.Title>
  <Card.Text>Content</Card.Text>
</Card.Body>
```

**Ví dụ trong code:**
```javascript
<Card.Body>
  <Card.Title>{lesson.lessonTitle}</Card.Title>
  <Card.Text>
    <strong>Level:</strong> {lesson.level}
  </Card.Text>
</Card.Body>
```

---

### **Card.Title**

**Chức năng:** Tiêu đề của card (thường là heading).

**Cách dùng:**
```javascript
<Card.Title>{lesson.lessonTitle}</Card.Title>
```

**Ví dụ trong code:**
```javascript
<Card.Title>{lesson.lessonTitle}</Card.Title>
```

---

### **Card.Text**

**Chức năng:** Đoạn text nội dung trong card.

**Cách dùng:**
```javascript
<Card.Text>
  <strong>Level:</strong> {lesson.level}
  <br />
  <strong>Time:</strong> {lesson.estimatedTime} minutes
</Card.Text>
```

**Ví dụ trong code:**
```javascript
<Card.Text>
  <strong>Level:</strong> {lesson.level}
  <br />
  <strong>Time:</strong> {Math.round(lesson.estimatedTime / 60)} minutes
</Card.Text>
```

---

## 4. TABLE COMPONENTS

### **Table**

**Chức năng:** Tạo bảng để hiển thị dữ liệu dạng table.

**Cách dùng:**
```javascript
import { Table } from "react-bootstrap";

<Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</Table>
```

**Props quan trọng:**
- `striped`: Tạo hiệu ứng sọc (zebra striping)
- `bordered`: Thêm border cho table
- `hover`: Highlight row khi hover
- `responsive`: Tự động scroll ngang trên mobile

**Ví dụ trong code:**
```javascript
<Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>ID</th>
      <th>Lesson Title</th>
      <th>Level</th>
    </tr>
  </thead>
  <tbody>
    {lessons.map((lesson) => (
      <tr key={lesson.id}>
        <td>{lesson.id}</td>
        <td>{lesson.lessonTitle}</td>
        <td>{lesson.level}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

### **thead (Table Header)**

**Chức năng:** Phần header của table, chứa các cột tiêu đề.

**Cách dùng:**
```javascript
<thead>
  <tr>
    <th>Column 1</th>
    <th>Column 2</th>
  </tr>
</thead>
```

**Giải thích:**
- `<thead>`: Wrapper cho header row
- `<tr>`: Table row
- `<th>`: Table header cell (in đậm, căn giữa)

**Ví dụ trong code:**
```javascript
<thead>
  <tr>
    <th>ID</th>
    <th>Lesson Title</th>
    <th>Level</th>
    <th>Estimated Time (min)</th>
    <th>Actions</th>
  </tr>
</thead>
```

---

### **tbody (Table Body)**

**Chức năng:** Phần body của table, chứa dữ liệu.

**Cách dùng:**
```javascript
<tbody>
  <tr>
    <td>Data 1</td>
    <td>Data 2</td>
  </tr>
</tbody>
```

**Giải thích:**
- `<tbody>`: Wrapper cho data rows
- `<tr>`: Table row
- `<td>`: Table data cell

**Ví dụ trong code:**
```javascript
<tbody>
  {lessons.map((lesson) => (
    <tr key={lesson.id} onClick={() => handleItemClick(lesson.id)}>
      <td>{lesson.id}</td>
      <td>{lesson.lessonTitle}</td>
      <td>{lesson.level}</td>
    </tr>
  ))}
</tbody>
```

---

### **tr (Table Row)**

**Chức năng:** Một hàng trong table.

**Cách dùng:**
```javascript
<tr key={lesson.id} onClick={() => handleClick(lesson.id)} style={{ cursor: "pointer" }}>
  <td>Data</td>
</tr>
```

**Props quan trọng:**
- `key`: Bắt buộc khi dùng trong map (React requirement)
- `onClick`: Handler khi click vào row
- `style`: Inline styles

**Ví dụ trong code:**
```javascript
<tr
  key={lesson.id}
  onClick={() => handleItemClick(lesson.id)}
  style={{ cursor: "pointer" }}
>
  <td>{lesson.id}</td>
  <td>{lesson.lessonTitle}</td>
</tr>
```

---

### **th (Table Header Cell)**

**Chức năng:** Một ô header trong table (tiêu đề cột).

**Cách dùng:**
```javascript
<th>Column Name</th>
```

**Ví dụ trong code:**
```javascript
<th>ID</th>
<th>Lesson Title</th>
<th>Level</th>
```

---

### **td (Table Data Cell)**

**Chức năng:** Một ô data trong table.

**Cách dùng:**
```javascript
<td>{lesson.id}</td>
<td colSpan="3" className="text-center">No data</td>
```

**Props quan trọng:**
- `colSpan`: Số cột mà cell này chiếm
- `className`: CSS classes

**Ví dụ trong code:**
```javascript
<td>{lesson.id}</td>
<td>{lesson.lessonTitle}</td>
<td colSpan="5" className="text-center">No lessons found.</td>
```

---

## 5. FORM COMPONENTS

### **Form**

**Chức năng:** Container cho form.

**Cách dùng:**
```javascript
import { Form } from "react-bootstrap";

<Form onSubmit={handleSubmit}>
  <Form.Group>
    {/* Form fields */}
  </Form.Group>
</Form>
```

**Ví dụ trong code:**
```javascript
<FormikForm>
  <Form.Group className="mb-3" controlId="lessonTitle">
    {/* ... */}
  </Form.Group>
</FormikForm>
```

---

### **Form.Group**

**Chức năng:** Wrapper cho một form field (label + input + error).

**Cách dùng:**
```javascript
<Form.Group className="mb-3" controlId="lessonTitle">
  <Form.Label>Lesson Title</Form.Label>
  <Form.Control type="text" name="lessonTitle" />
</Form.Group>
```

**Props quan trọng:**
- `className="mb-3"`: Margin bottom (khoảng cách giữa các fields)
- `controlId`: ID để link label với input (accessibility)

**Ví dụ trong code:**
```javascript
<Form.Group className="mb-3" controlId="lessonTitle">
  <Form.Label>Lesson Title</Form.Label>
  <Field type="text" name="lessonTitle" as={Form.Control} />
  <ErrorMessage name="lessonTitle" component={Form.Text} />
</Form.Group>
```

---

### **Form.Label**

**Chức năng:** Label cho form field.

**Cách dùng:**
```javascript
<Form.Label htmlFor="lessonTitle">Lesson Title</Form.Label>
```

**Props quan trọng:**
- `htmlFor`: ID của input để link (accessibility)

**Ví dụ trong code:**
```javascript
<Form.Label>Lesson Title</Form.Label>
```

---

### **Form.Control**

**Chức năng:** Input field (text, number, email, etc.).

**Cách dùng:**
```javascript
<Form.Control
  type="text"
  name="lessonTitle"
  value={value}
  onChange={handleChange}
  isInvalid={!!error}
/>
```

**Props quan trọng:**
- `type`: Loại input (`"text"`, `"number"`, `"email"`, etc.)
- `name`: Name attribute
- `value`: Giá trị
- `onChange`: Handler khi thay đổi
- `isInvalid`: Hiển thị border đỏ nếu có lỗi

**Ví dụ trong code:**
```javascript
<Field type="text" name="lessonTitle" as={Form.Control} />
```

---

### **Form.Select**

**Chức năng:** Dropdown select box.

**Cách dùng:**
```javascript
<Form.Select name="level" value={value} onChange={handleChange}>
  <option value="N5">N5</option>
  <option value="N4">N4</option>
  <option value="N3">N3</option>
  <option value="N2">N2</option>
  <option value="N1">N1</option>
</Form.Select>
```

**Ví dụ trong code:**
```javascript
<Field as={Form.Select} name="level">
  <option value="N5">N5</option>
  <option value="N4">N4</option>
  <option value="N3">N3</option>
  <option value="N2">N2</option>
  <option value="N1">N1</option>
</Field>
```

---

### **Form.Check**

**Chức năng:** Checkbox hoặc switch control.

**Cách dùng:**
```javascript
<Form.Check
  type="switch"
  id="isCompleted"
  name="isCompleted"
  label="Is Completed?"
  checked={isCompleted}
  onChange={handleChange}
/>
```

**Props quan trọng:**
- `type="switch"`: Tạo switch control (toggle)
- `type="checkbox"`: Tạo checkbox
- `label`: Text hiển thị bên cạnh

**Ví dụ trong code:**
```javascript
<Field
  as={FormCheck}
  type="switch"
  name="isCompleted"
  label="Is Completed?"
/>
```

---

### **Form.Text**

**Chức năng:** Text nhỏ dưới input (thường dùng cho error message).

**Cách dùng:**
```javascript
<Form.Text className="text-danger">
  {errorMessage}
</Form.Text>
```

**Ví dụ trong code:**
```javascript
<ErrorMessage
  name="lessonTitle"
  component={Form.Text}
  className="text-danger"
/>
```

---

## 6. BUTTON COMPONENTS

### **Button**

**Chức năng:** Nút bấm.

**Cách dùng:**
```javascript
import { Button } from "react-bootstrap";

<Button variant="primary" type="submit" disabled={isSubmitting}>
  Submit
</Button>
```

**Props quan trọng:**
- `variant`: Màu sắc (`"primary"`, `"secondary"`, `"success"`, `"danger"`, `"warning"`, `"info"`)
- `size`: Kích thước (`"sm"` = small, `"lg"` = large)
- `type`: Type của button (`"button"`, `"submit"`, `"reset"`)
- `disabled`: Vô hiệu hóa button
- `onClick`: Handler khi click

**Ví dụ trong code:**
```javascript
<Button variant="primary" type="submit" disabled={isSubmitting}>
  {isSubmitting ? <Spinner as="span" size="sm" /> : "Add Lesson"}
</Button>

<Button variant="warning" size="sm" onClick={(e) => handleEdit(e, id)}>
  Edit
</Button>

<Button variant="danger" size="sm" onClick={(e) => handleDelete(e, id)}>
  Delete
</Button>
```

---

## 7. FEEDBACK COMPONENTS

### **Spinner**

**Chức năng:** Hiển thị loading spinner.

**Cách dùng:**
```javascript
import { Spinner } from "react-bootstrap";

<Spinner animation="border" role="status" className="d-block mx-auto" />
```

**Props quan trọng:**
- `animation="border"`: Kiểu spinner (border hoặc grow)
- `role="status"`: Accessibility attribute
- `size="sm"`: Kích thước nhỏ (dùng trong button)
- `className="d-block mx-auto"`: Căn giữa

**Ví dụ trong code:**
```javascript
// Full page spinner
if (loading) {
  return (
    <Spinner animation="border" role="status" className="d-block mx-auto" />
  );
}

// Spinner trong button
<Button disabled={isSubmitting}>
  {isSubmitting ? <Spinner as="span" size="sm" /> : "Submit"}
</Button>
```

---

### **Alert**

**Chức năng:** Hiển thị thông báo (success, error, warning, info).

**Cách dùng:**
```javascript
import { Alert } from "react-bootstrap";

<Alert variant="danger">Error loading data: {error}</Alert>
```

**Props quan trọng:**
- `variant`: Loại alert (`"success"`, `"danger"`, `"warning"`, `"info"`)

**Ví dụ trong code:**
```javascript
if (error) {
  return <Alert variant="danger">Error loading data: {error}</Alert>;
}

if (!lesson) {
  return <Alert variant="warning">Lesson not found.</Alert>;
}
```

---

### **Toast & ToastContainer**

**Chức năng:** Hiển thị notification popup (toast message).

**Cách dùng:**
```javascript
import { Toast, ToastContainer } from "react-bootstrap";

<ToastContainer position="top-end" className="p-3">
  <Toast
    show={showToast}
    onClose={() => setShowToast(false)}
    delay={3000}
    autohide
    bg={toastVariant}
  >
    <Toast.Header>
      <strong className="me-auto">Success</strong>
    </Toast.Header>
    <Toast.Body className="text-white">
      {toastMessage}
    </Toast.Body>
  </Toast>
</ToastContainer>
```

**Props quan trọng:**
- `show`: Hiển thị toast (boolean)
- `onClose`: Handler khi đóng
- `delay`: Thời gian tự đóng (milliseconds)
- `autohide`: Tự động đóng sau delay
- `bg`: Background color (`"success"`, `"danger"`, etc.)
- `position`: Vị trí của ToastContainer (`"top-end"`, `"top-start"`, `"bottom-end"`, etc.)

**Ví dụ trong code:**
```javascript
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");

// Sau khi delete thành công
setToastMessage("Lesson deleted successfully!");
setShowToast(true);

// Render
<ToastContainer position="top-end" className="p-3">
  <Toast
    show={showToast}
    onClose={() => setShowToast(false)}
    delay={3000}
    autohide
    bg="success"
  >
    <Toast.Header>
      <strong className="me-auto">Success</strong>
    </Toast.Header>
    <Toast.Body className="text-white">
      {toastMessage}
    </Toast.Body>
  </Toast>
</ToastContainer>
```

---

## 8. IMAGE COMPONENTS

### **Image**

**Chức năng:** Hiển thị hình ảnh với các style options.

**Cách dùng:**
```javascript
import { Image } from "react-bootstrap";

<Image
  src={lesson.lessonImage}
  alt={lesson.lessonTitle}
  thumbnail
  style={{ width: "100px", height: "auto" }}
/>
```

**Props quan trọng:**
- `src`: URL của ảnh
- `alt`: Text mô tả (accessibility)
- `thumbnail`: Thêm border và padding (ảnh nhỏ)
- `rounded`: Bo góc
- `style`: Inline styles

**Ví dụ trong code:**
```javascript
<Image
  src={lesson.lessonImage}
  alt={lesson.lessonTitle}
  thumbnail
  style={{ width: "100px", height: "auto" }}
/>
```

---

## 📋 TÓM TẮT CÁC COMPONENTS THƯỜNG DÙNG

| Component | Chức năng | Ví dụ sử dụng |
|-----------|-----------|---------------|
| `Container` | Container responsive | Wrapper cho nội dung chính |
| `Row` / `Col` | Grid layout | Sắp xếp items theo cột |
| `Navbar` | Navigation bar | Menu điều hướng |
| `Card` | Card container | Hiển thị lesson cards |
| `Table` | Bảng dữ liệu | Danh sách lessons |
| `Form` | Form container | Form thêm/sửa lesson |
| `Button` | Nút bấm | Submit, Edit, Delete |
| `Spinner` | Loading indicator | Hiển thị khi đang load |
| `Alert` | Thông báo | Hiển thị lỗi/thành công |
| `Toast` | Notification popup | Thông báo sau khi delete |
| `Image` | Hình ảnh | Hiển thị ảnh lesson |

---

## 💡 TIPS QUAN TRỌNG

1. **Import đúng cách:**
   ```javascript
   // Cách 1: Import từng component
   import { Button, Card } from "react-bootstrap";
   
   // Cách 2: Import từng file riêng (nhẹ hơn)
   import Button from "react-bootstrap/Button";
   import Card from "react-bootstrap/Card";
   ```

2. **Kết hợp với React Router:**
   ```javascript
   <Nav.Link as={Link} to="/path">Home</Nav.Link>
   <Button as={Link} to="/path">Go to</Button>
   ```

3. **Responsive classes:**
   - `xs`: Extra small (mobile)
   - `sm`: Small (tablet)
   - `md`: Medium (tablet landscape)
   - `lg`: Large (desktop)
   - `xl`: Extra large (large desktop)

4. **Utility classes:**
   - `mt-4`: Margin top
   - `mb-4`: Margin bottom
   - `ms-2`: Margin start (left)
   - `me-auto`: Margin end auto (push to left)
   - `d-block`: Display block
   - `mx-auto`: Margin x auto (căn giữa)
   - `text-center`: Căn giữa text
   - `g-4`: Gap giữa các items trong grid

---

**Chúc bạn sử dụng Bootstrap components hiệu quả! 🚀**

