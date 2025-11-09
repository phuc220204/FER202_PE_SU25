# 📚 HƯỚNG DẪN CHI TIẾT: CÁCH FETCH DATA TỪ API TRONG REACT

## 🎯 MỤC LỤC
1. [Giải thích tại sao viết code như vậy](#giải-thích-tại-sao-viết-code-như-vậy)
2. [Cấu trúc API và Data](#cấu-trúc-api-và-data)
3. [Các Pattern Fetch Data](#các-pattern-fetch-data)
4. [Ví dụ cụ thể cho từng trang](#ví-dụ-cụ-thể-cho-từng-trang)
5. [Best Practices](#best-practices)

---

## 🔍 GIẢI THÍCH TẠI SAO VIẾT CODE NHƯ VẬY

### **Ví dụ từ LessonDetailPage.jsx (dòng 6-11):**

```javascript
export default function LessonDetailPage() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
```

### **1. `useState` - Quản lý State trong Component**

#### **Tại sao cần `useState`?**
- React là **declarative** (khai báo), không phải **imperative** (mệnh lệnh)
- Khi data thay đổi, React cần **re-render** component
- `useState` giúp React **theo dõi** và **cập nhật** UI khi state thay đổi

#### **Cú pháp:**
```javascript
const [stateName, setStateName] = useState(initialValue);
```

#### **Giải thích từng state:**

**a) `const [lesson, setLesson] = useState(null);`**
- **Mục đích**: Lưu trữ data của 1 lesson cụ thể
- **Giá trị ban đầu**: `null` (vì chưa fetch được data)
- **Khi nào thay đổi**: Sau khi gọi API thành công → `setLesson(data)`

**b) `const [loading, setLoading] = useState(true);`**
- **Mục đích**: Hiển thị loading spinner khi đang fetch data
- **Giá trị ban đầu**: `true` (mặc định đang loading)
- **Khi nào thay đổi**: 
  - Bắt đầu fetch → `setLoading(true)`
  - Kết thúc fetch (thành công hoặc lỗi) → `setLoading(false)`

**c) `const [error, setError] = useState(null);`**
- **Mục đích**: Lưu thông báo lỗi nếu API call thất bại
- **Giá trị ban đầu**: `null` (chưa có lỗi)
- **Khi nào thay đổi**: 
  - Có lỗi → `setError(err.message)`
  - Fetch thành công → `setError(null)`

### **2. `useParams` - Lấy tham số từ URL**

#### **Tại sao cần `useParams`?**
- URL: `/se181834/lessons/:id` → `:id` là **dynamic parameter**
- Cần lấy `id` từ URL để fetch đúng lesson

#### **Cú pháp:**
```javascript
const { id } = useParams();
```

#### **Ví dụ:**
- URL: `/se181834/lessons/1` → `id = "1"`
- URL: `/se181834/lessons/5` → `id = "5"`

### **3. `useNavigate` - Điều hướng giữa các trang**

#### **Tại sao cần `useNavigate`?**
- Thay vì dùng `<Link>`, có thể **programmatically navigate**
- Ví dụ: Sau khi submit form → tự động chuyển trang

#### **Cú pháp:**
```javascript
const navigate = useNavigate();
navigate("/path");           // Chuyển đến trang khác
navigate(-1);                // Quay lại trang trước
```

---

## 📊 CẤU TRÚC API VÀ DATA

### **API Base URL:**
- Được lưu trong file `.env`: `VITE_API_URL=https://6907b85fb1879c890eda8b1b.mockapi.io/SE181834`
- File `apiCaller.js` tự động thêm baseURL vào mọi request

### **Cấu trúc Data từ API:**

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
  }
  // ... 8 lessons khác
]
```

### **Các Endpoint API:**

| Method | Endpoint | Mô tả | Response |
|--------|----------|-------|----------|
| `GET` | `/` | Lấy tất cả lessons | Array of lessons |
| `GET` | `/:id` | Lấy 1 lesson theo ID | Single lesson object |
| `POST` | `/` | Tạo lesson mới | Created lesson object |
| `PUT` | `/:id` | Cập nhật lesson | Updated lesson object |
| `DELETE` | `/:id` | Xóa lesson | Deleted lesson object |

---

## 🔄 CÁC PATTERN FETCH DATA

### **Pattern 1: Fetch Data khi Component Mount (GET All)**

**Sử dụng khi:** Cần lấy danh sách data ngay khi trang load

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await get("/");  // GET tất cả
      setData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []); // Empty dependency array = chỉ chạy 1 lần khi mount
```

**Ví dụ:** HomePage, AllLessonsPage, CompletedLessonsPage

---

### **Pattern 2: Fetch Data theo ID từ URL (GET One)**

**Sử dụng khi:** Cần lấy data của 1 item cụ thể dựa trên ID trong URL

```javascript
const { id } = useParams();

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await get(`/${id}`);  // GET theo ID
      setData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [id]); // Chạy lại khi id thay đổi
```

**Ví dụ:** LessonDetailPage

---

### **Pattern 3: Fetch Data có điều kiện (Conditional Fetch)**

**Sử dụng khi:** Chỉ fetch khi có điều kiện nhất định

```javascript
useEffect(() => {
  if (isEditMode) {  // Chỉ fetch khi đang edit
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await get(`/${id}`);
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }
}, [id, isEditMode]);
```

**Ví dụ:** AddLessonPage (khi edit mode)

---

### **Pattern 4: Fetch Data sau khi thao tác (Refetch)**

**Sử dụng khi:** Sau khi DELETE, cần reload lại danh sách

```javascript
const fetchLessons = async () => {
  try {
    setLoading(true);
    const data = await get("/");
    setLessons(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id) => {
  try {
    await remove(`/${id}`);  // DELETE
    fetchLessons();          // Reload lại danh sách
  } catch (err) {
    setError(err.message);
  }
};
```

**Ví dụ:** AllLessonsPage (sau khi delete)

---

## 📝 VÍ DỤ CỤ THỂ CHO TỪNG TRANG

### **1. HomePage - Lấy danh sách lessons chưa hoàn thành**

```javascript
import { useState, useEffect } from "react";
import { get } from "../api/apiCaller";

export default function HomePage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        // GET tất cả lessons
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
  }, []); // Chỉ chạy 1 lần khi component mount

  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;

  return (
    <div>
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <Card.Title>{lesson.lessonTitle}</Card.Title>
          {/* ... */}
        </Card>
      ))}
    </div>
  );
}
```

**Giải thích:**
- `get("/")` → Trả về array 10 lessons
- `filter(!lesson.isCompleted)` → Chỉ lấy lessons có `isCompleted: false`
- Kết quả: 6 lessons (id: 1, 2, 6, 7, 8, 10)

---

### **2. AllLessonsPage - Lấy tất cả lessons và sort**

```javascript
export default function AllLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tách hàm fetch ra ngoài để có thể gọi lại
  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await get("/");
      
      // Sort descending theo id (id lớn nhất trước)
      const sortedData = data.sort((a, b) => 
        parseInt(b.id) - parseInt(a.id)
      );
      
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

  // Sau khi delete, gọi lại fetchLessons()
  const handleDelete = async (id) => {
    await remove(`/${id}`);
    fetchLessons(); // Reload
  };

  // ... render
}
```

**Giải thích:**
- `get("/")` → Lấy tất cả 10 lessons
- `sort((a, b) => parseInt(b.id) - parseInt(a.id))` → Sắp xếp id giảm dần
- Kết quả: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

---

### **3. CompletedLessonsPage - Lấy lessons đã hoàn thành**

```javascript
export default function CompletedLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await get("/");
        
        // Filter chỉ lấy completed lessons
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

  // ... render
}
```

**Giải thích:**
- `filter(lesson.isCompleted)` → Chỉ lấy lessons có `isCompleted: true`
- Kết quả: 4 lessons (id: 3, 4, 5, 9)
- Sort: [9, 5, 4, 3]

---

### **4. LessonDetailPage - Lấy 1 lesson theo ID**

```javascript
import { useParams } from "react-router-dom";

export default function LessonDetailPage() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy id từ URL: /se181834/lessons/:id
  const { id } = useParams();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // GET lesson theo ID
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
  }, [id]); // Chạy lại khi id thay đổi

  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;
  if (!lesson) return <Alert>Lesson not found</Alert>;

  return (
    <Card>
      <Card.Title>{lesson.lessonTitle}</Card.Title>
      <Card.Img src={lesson.lessonImage} />
      {/* ... */}
    </Card>
  );
}
```

**Giải thích:**
- URL: `/se181834/lessons/1` → `id = "1"`
- `get("/1")` → Trả về object lesson có id = "1"
- Nếu URL đổi thành `/se181834/lessons/5` → `useEffect` tự động chạy lại

---

### **5. AddLessonPage - Fetch data khi Edit Mode**

```javascript
import { useParams } from "react-router-dom";

export default function AddLessonPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id); // true nếu có id trong URL
  
  const [initialValues, setInitialValues] = useState({
    lessonTitle: "",
    lessonImage: "",
    level: "N5",
    estimatedTime: "",
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Chỉ fetch khi đang edit (có id)
    if (isEditMode) {
      setLoading(true);
      get(`/${id}`)
        .then((data) => {
          // Điền data vào form
          setInitialValues(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  // ... form
}
```

**Giải thích:**
- **Add mode**: URL `/se181834/add-lesson` → `id = undefined` → không fetch
- **Edit mode**: URL `/se181834/edit-lesson/1` → `id = "1"` → fetch lesson có id = "1"
- Sau khi fetch, điền data vào form để user edit

---

### **6. AddLessonPage - POST và PUT**

```javascript
const handleSubmit = async (values) => {
  try {
    if (isEditMode) {
      // PUT: Cập nhật lesson có id
      await put(`/${id}`, values);
      alert("Lesson updated successfully!");
    } else {
      // POST: Tạo lesson mới
      await post("/", values);
      alert("Lesson added successfully!");
    }
    
    // Chuyển về trang All Lessons
    navigate("/se181834/all-lessons");
  } catch (err) {
    setError(err.message);
  }
};
```

**Giải thích:**
- **POST `/`**: Tạo lesson mới, API tự động tạo `id` mới
- **PUT `/:id`**: Cập nhật lesson có `id` cụ thể

---

### **7. AllLessonsPage - DELETE**

```javascript
const handleDelete = async (id) => {
  // Xác nhận trước khi delete
  const isConfirmed = window.confirm(
    "Are you sure you want to delete this lesson?"
  );

  if (isConfirmed) {
    try {
      // DELETE lesson theo ID
      await remove(`/${id}`);
      
      // Hiển thị thông báo thành công
      setToastMessage("Lesson deleted successfully!");
      setShowToast(true);
      
      // Reload lại danh sách
      fetchLessons();
    } catch (err) {
      setToastMessage(`Error: ${err.message}`);
      setShowToast(true);
    }
  }
};
```

**Giải thích:**
- `remove("/1")` → Xóa lesson có id = "1"
- Sau khi delete thành công → gọi `fetchLessons()` để reload danh sách mới

---

## ✅ BEST PRACTICES

### **1. Luôn xử lý Loading State**

```javascript
const [loading, setLoading] = useState(true);

// Bắt đầu fetch
setLoading(true);

// Kết thúc fetch (thành công hoặc lỗi)
finally {
  setLoading(false);
}

// Hiển thị UI
if (loading) return <Spinner />;
```

### **2. Luôn xử lý Error State**

```javascript
const [error, setError] = useState(null);

try {
  const data = await get("/");
  setError(null); // Clear error khi thành công
} catch (err) {
  setError(err.message); // Lưu error message
}

if (error) return <Alert>{error}</Alert>;
```

### **3. Sử dụng try-catch-finally**

```javascript
try {
  // Code có thể lỗi
  const data = await get("/");
} catch (err) {
  // Xử lý lỗi
  setError(err.message);
} finally {
  // Luôn chạy (dù thành công hay lỗi)
  setLoading(false);
}
```

### **4. Dependency Array trong useEffect**

```javascript
// Chạy 1 lần khi mount
useEffect(() => {
  fetchData();
}, []);

// Chạy lại khi id thay đổi
useEffect(() => {
  fetchData();
}, [id]);

// Chạy lại khi id hoặc isEditMode thay đổi
useEffect(() => {
  fetchData();
}, [id, isEditMode]);
```

### **5. Tách hàm fetch ra ngoài nếu cần gọi lại**

```javascript
// ✅ Tốt: Có thể gọi lại sau khi delete
const fetchLessons = async () => {
  const data = await get("/");
  setLessons(data);
};

useEffect(() => {
  fetchLessons();
}, []);

const handleDelete = async (id) => {
  await remove(`/${id}`);
  fetchLessons(); // Gọi lại
};
```

```javascript
// ❌ Không tốt: Không thể gọi lại
useEffect(() => {
  const fetchLessons = async () => {
    const data = await get("/");
    setLessons(data);
  };
  fetchLessons();
}, []);

// Không thể gọi fetchLessons() ở nơi khác
```

---

## 📋 TÓM TẮT

### **Các bước fetch data cơ bản:**

1. **Khai báo state**: `useState` cho data, loading, error
2. **Lấy params** (nếu cần): `useParams()` để lấy ID từ URL
3. **Fetch trong useEffect**: Gọi API khi component mount hoặc khi dependency thay đổi
4. **Xử lý response**: 
   - Thành công → `setData()`, `setError(null)`
   - Lỗi → `setError(err.message)`
5. **Luôn set loading**: `setLoading(false)` trong `finally`
6. **Render UI**: Kiểm tra loading/error trước khi render data

### **Các hàm API từ apiCaller.js:**

- `get(endpoint)` → GET request
- `post(endpoint, body)` → POST request
- `put(endpoint, body)` → PUT request
- `remove(endpoint)` → DELETE request

---

**Chúc bạn code vui vẻ! 🚀**

