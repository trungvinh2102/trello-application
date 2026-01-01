# Trello System Features

Dựa trên schema database hoàn chỉnh, hệ thống Trello này hỗ trợ các chức năng sau:

## 1. Quản lý Người dùng (Users)
- ✅ Đăng ký/đăng nhập với email và password (bcrypt hash)
- ✅ Thông tin cá nhân (avatar, tên đầy đủ)
- ✅ Authentication và authorization

## 2. Quản lý Boards/Projects
- ✅ Tạo, sửa, xóa boards
- ✅ 3 mức độ quyền truy cập:
  - `private`: Chỉ chủ sở hữu xem được
  - `workspace`: Thành viên workspace có thể xem
  - `public`: Ai cũng có thể xem
- ✅ Tùy chỉnh màu nền cho từng board

## 3. Quản lý Thành viên & Phân quyền
- ✅ Mời người dùng vào board với 3 vai trò:
  - `admin`: Toàn quyền quản lý board
  - `member`: Có thể chỉnh sửa cards
  - `observer`: Chỉ được xem
- ✅ Quản lý danh sách thành viên
- ✅ Tracking thời gian tham gia (joined_at)

## 4. Quản lý Columns (Lists)
- ✅ Tạo các cột trạng thái (To Do, In Progress, Done...)
- ✅ Sắp xếp lại thứ tự columns (position field)
- ✅ Tùy chỉnh theo từng board

## 5. Quản lý Cards (Nhiệm vụ)
- ✅ Tạo, sửa, xóa cards
- ✅ Mô tả chi tiết công việc
- ✅ Due date (ngày hạn chót)
- ✅ Đánh dấu hoàn thành (completed)
- ✅ Drag & drop giữa columns
- ✅ Sắp xếp vị trí (position field)

## 6. Phân công nhiệm vụ (Card_Members)
- ✅ Gán nhiều thành viên cho 1 card
- ✅ Theo dõi ai chịu trách nhiệm
- ✅ Tracking thời gian gán (assigned_at)

## 7. Labels (Tags)
- ✅ Tạo nhãn màu sắc cho card
- ✅ Phân loại theo priority, type, team...
- ✅ Filter theo labels
- ✅ Labels thuộc board (thuộc sở hữu của board)

## 8. Checklists
- ✅ Tạo checklist trong card
- ✅ Thêm các items con
- ✅ Đánh dấu hoàn thành từng item
- ✅ Progress tracking (completed/total items)
- ✅ Tracking thời gian hoàn thành (completed_at)

## 9. Bình luận (Comments)
- ✅ Thảo luận trên từng card
- ✅ Lịch sử comment
- ✅ User info trong mỗi comment
- ✅ Theo dõi thời gian tạo (created_at)

## 10. File đính kèm (Attachments)
- ✅ Upload files vào card
- ✅ Hỗ trợ nhiều loại file (mime_type)
- ✅ Lưu trữ URL (S3, local storage)
- ✅ Tracking kích thước file (file_size)
- ✅ Tên file gốc

## 11. Lịch sử hoạt động (Activities)
- ✅ Audit log đầy đủ
- ✅ Theo dõi ai làm gì, khi nào
- ✅ Chi tiết thay đổi (JSON field linh hoạt)
- ✅ Tìm kiếm, filter lịch sử
- ✅ Tìm kiếm theo: board, card, user, action
- ✅ Tìm kiếm theo thời gian (created_at index)

## Tính năng mở rộng

### Permissions System
- Role-based access control (RBAC)
- 3 roles: admin, member, observer
- Per-board permissions
- Cascade delete bảo toàn dữ liệu

### Performance Optimization
- Indexes cho tất cả các foreign keys
- Indexes cho các field tìm kiếm thường xuyên
- Indexes cho timestamp queries
- JSONB field cho linh hoạt lưu trữ details

### Data Integrity
- Foreign key constraints
- Cascade delete rules
- Unique constraints
- Auto-update timestamps (trigger)

### Multi-tenancy
- Boards riêng biệt với visibility settings
- Thành viên board độc lập
- Labels thuộc board
- Activities theo board

## Các Action Types trong Activities
- `board_created`
- `board_updated`
- `board_deleted`
- `column_created`
- `column_updated`
- `column_deleted`
- `card_created`
- `card_updated`
- `card_deleted`
- `card_moved`
- `card_assigned`
- `comment_added`
- `checklist_created`
- `checklist_item_completed`
- `attachment_added`
- `label_added`
- `member_added`
- `member_removed`

## Workflow ví dụ

### 1. Tạo dự án mới
```
User (admin) → Create Board → Set visibility (private)
  ↓
Add Members (admin, member, observer)
  ↓
Create Columns (To Do, In Progress, Done)
```

### 2. Quản lý nhiệm vụ
```
Create Card → Assign Members → Add Labels
  ↓
Add Due Date → Add Checklist → Add Comments
  ↓
Move Card → Complete Checklist Items → Mark Done
```

### 3. Theo dõi hoạt động
```
Activities table logs:
- Who performed action (user_id)
- What action (action field)
- Where (board_id, card_id)
- Details (JSON with context)
- When (created_at)
```

## Use Cases

### Product Development
- Sprints, Backlog, Progress tracking
- Assign team members to features
- Bug tracking with labels
- PR reviews via comments

### Marketing Campaigns
- Campaign boards with tasks
- Deadline tracking (due dates)
- Team collaboration
- File attachments (assets)

### Project Management
- Project boards
- Task breakdown (checklists)
- Progress visualization
- Activity audit trail

### Personal Task Management
- Private boards
- Personal tasks
- Checklists for habits
- Activity history

## Tính năng nâng rộng có thể thêm

### 1. Real-time Updates
- WebSockets cho real-time collaboration
- Live updates khi có người khác chỉnh sửa
- Notifications khi được assign

### 2. Search & Filter
- Full-text search
- Filter by labels, members, due dates
- Advanced queries

### 3. Analytics & Reporting
- Charts, graphs
- Team productivity
- Burndown/burnup charts
- Time tracking

### 4. Integrations
- GitHub (PRs, issues)
- Slack notifications
- Google Calendar sync
- Email notifications

### 5. Webhooks
- External integrations
- Custom automations
- API triggers

### 6. Templates
- Board templates
- Card templates
- Checklist templates

### 7. Power-Ups (Plugins)
- Custom fields
- Voting
- Card aging
- Custom buttons

### 8. Mobile Apps
- React Native / Flutter
- Push notifications
- Offline support

### 9. AI Features
- Smart suggestions
- Auto-classification
- Predictive analytics
- Natural language processing

### 10. Enterprise Features
- SSO (Single Sign-On)
- Audit logs export
- Advanced permissions
- Compliance reports
