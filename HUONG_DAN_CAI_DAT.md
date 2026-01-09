# Hướng Dẫn Cài Đặt và Chạy FlyView

## Giới Thiệu
FlyView là hệ thống hiển thị thông tin chuyến bay (Flight Information Display System) được xây dựng bằng Next.js, React, TypeScript và Firebase.

## Yêu Cầu Hệ Thống

Trước khi cài đặt, đảm bảo máy tính của bạn đã cài đặt:

- **Node.js**: phiên bản 16.x trở lên (khuyến nghị 18.x hoặc 20.x)
- **npm**: phiên bản 8.x trở lên (đi kèm với Node.js)
- **Git**: để clone repository
- **Tài khoản Firebase**: để cấu hình database và authentication

Kiểm tra phiên bản hiện tại:
```bash
node --version
npm --version
```

## Bước 1: Clone Repository

```bash
git clone https://github.com/ThienVanTech/flyview.git
cd flyview
```

## Bước 2: Cài Đặt Dependencies

Cài đặt tất cả các package cần thiết:

```bash
npm install
```

Quá trình này sẽ cài đặt các dependencies chính bao gồm:
- Next.js (framework)
- React (UI library)
- Firebase (database và authentication)
- Chakra UI (component library)
- TypeScript (type safety)

## Bước 3: Cấu Hình Firebase

### 3.1. Tạo Project Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo một project mới hoặc sử dụng project có sẵn
3. Trong phần Project Settings, tìm phần "Your apps" và chọn thêm web app
4. Copy thông tin cấu hình Firebase

### 3.2. Cấu Hình Environment Variables

Tạo file `.env.local` trong thư mục gốc của project:

```bash
touch .env.local
```

Thêm các biến môi trường sau vào file `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Lưu ý**: 
- Thay thế các giá trị `your_*` bằng thông tin từ Firebase Console
- File `.env.local` sẽ không được commit vào Git (đã được thêm vào `.gitignore`)
- Tham khảo file `.env.example` để biết cấu trúc chính xác

### 3.3. Cấu Hình Firebase Database (Firestore)

1. Trong Firebase Console, vào phần **Firestore Database**
2. Click "Create database"
3. Chọn chế độ:
   - **Test mode**: cho development (dữ liệu public, chỉ dùng tạm thời)
   - **Production mode**: cho production (cần cấu hình rules)

4. Chọn location gần nhất với người dùng của bạn

#### Cấu Trúc Database

FlyView sử dụng Firestore với cấu trúc collections sau:

```
firestore/
├── airlines/
│   └── {airlineCode}/
│       ├── name: string
│       ├── logo: string
│       ├── headerColor: string
│       └── textColor: string
└── flights/
    └── {flightId}/
        ├── airlineCode: string
        ├── flightNumber: string
        ├── destination: string
        ├── departureTime: timestamp
        ├── gate: string
        ├── status: string
        └── date: string
```

#### Firestore Security Rules (khuyến nghị)

Vào phần **Firestore Database > Rules** và cập nhật rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cho phép đọc public cho flights và airlines
    match /flights/{flight} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /airlines/{airline} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3.4. Cấu Hình Firebase Authentication

1. Trong Firebase Console, vào phần **Authentication**
2. Click "Get started"
3. Enable các phương thức đăng nhập:
   - **Email/Password**: cho đăng nhập cơ bản
   - Hoặc các provider khác nếu cần (Google, Facebook, etc.)

## Bước 4: Chạy Ứng Dụng

### Chế Độ Development

Để chạy ứng dụng trong chế độ development với hot reload:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### Build Production

Để build ứng dụng cho production:

```bash
npm run build
```

Sau khi build xong, chạy ứng dụng production:

```bash
npm start
```

### Linting

Để kiểm tra code style và lỗi:

```bash
npm run lint
```

## Cấu Trúc Project

```
flyview/
├── components/          # React components tái sử dụng
├── contexts/           # React Context providers
├── hoc/               # Higher Order Components
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages (routing)
│   ├── _app.tsx       # App wrapper
│   ├── _document.tsx  # Document wrapper
│   ├── index.tsx      # Trang chủ (dashboard)
│   ├── login.tsx      # Trang đăng nhập
│   ├── add.tsx        # Thêm chuyến bay
│   ├── edit.tsx       # Chỉnh sửa chuyến bay
│   └── viewer.tsx     # Màn hình hiển thị FID
├── public/            # Static files (images, fonts)
├── styles/            # CSS/styling files
├── theme/             # Chakra UI theme configuration
├── firebaseConfig.js  # Firebase initialization
├── next.config.js     # Next.js configuration
├── package.json       # Dependencies và scripts
└── tsconfig.json      # TypeScript configuration
```

## Kết Nối API

FlyView sử dụng Firebase làm backend, không có REST API riêng. Tất cả các tương tác với database được thực hiện thông qua Firebase SDK:

### Các File Quan Trọng Cho API/Database:

1. **firebaseConfig.js**: Khởi tạo Firebase app và export các services
   - `auth`: Firebase Authentication instance
   - `db`: Firestore Database instance

2. **Sử dụng trong components**:
   ```javascript
   import { db, auth } from '../firebaseConfig';
   import { collection, addDoc, getDocs } from 'firebase/firestore';
   
   // Thêm chuyến bay
   await addDoc(collection(db, 'flights'), flightData);
   
   // Lấy danh sách chuyến bay
   const snapshot = await getDocs(collection(db, 'flights'));
   ```

## Troubleshooting

### Lỗi "Firebase: Error (auth/...)"
- Kiểm tra lại các biến môi trường trong `.env.local`
- Đảm bảo Authentication đã được enable trong Firebase Console

### Lỗi "Module not found"
- Chạy lại `npm install`
- Xóa thư mục `node_modules` và file `package-lock.json`, sau đó `npm install` lại

### Lỗi TypeScript
- Chạy `npm run lint` để kiểm tra lỗi
- Kiểm tra file `tsconfig.json` có đúng cấu hình

### Port 3000 đã được sử dụng
- Thay đổi port bằng cách chạy: `PORT=3001 npm run dev`
- Hoặc kill process đang sử dụng port 3000

## Deployment

Ứng dụng có thể deploy lên các platform:

- **Vercel** (khuyến nghị cho Next.js): [vercel.com](https://vercel.com)
- **Netlify**: [netlify.com](https://netlify.com)
- **Firebase Hosting**: [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)

**Lưu ý**: Khi deploy, cần cấu hình environment variables trên platform tương ứng.

## Tài Liệu Tham Khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Chakra UI Documentation](https://chakra-ui.com/docs)

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra phần Troubleshooting ở trên
2. Tìm kiếm issues trên GitHub repository
3. Tạo issue mới với mô tả chi tiết vấn đề
