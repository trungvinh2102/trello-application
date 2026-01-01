-- Tạo database schema cho PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bảng Users: Quản lý người dùng
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger cho users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enum cho visibility và roles
CREATE TYPE visibility_enum AS ENUM ('private', 'workspace', 'public');
CREATE TYPE member_role_enum AS ENUM ('admin', 'member', 'observer');

-- Bảng Boards: Bảng chính (Projects)
CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL,
    visibility visibility_enum DEFAULT 'private',
    background_color VARCHAR(20),
    ordered_columns_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_boards_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_boards_updated_at
    BEFORE UPDATE ON boards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng Board_Members: Thành viên của board (many-to-many)
CREATE TABLE IF NOT EXISTS board_members (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role member_role_enum DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_board_user UNIQUE (board_id, user_id),
    CONSTRAINT fk_board_members_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    CONSTRAINT fk_board_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Columns: Danh sách (cột) trong board
CREATE TABLE IF NOT EXISTS columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    board_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,
    ordered_columns_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_columns_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TRIGGER update_columns_updated_at
    BEFORE UPDATE ON columns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng Cards: Thẻ nhiệm vụ
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    board_id INTEGER NOT NULL,
    column_id INTEGER NOT NULL,
    due_date TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cards_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_column FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);

CREATE TRIGGER update_cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bảng Card_Members: Gán thành viên cho card (assignments)
CREATE TABLE IF NOT EXISTS card_members (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_card_user UNIQUE (card_id, user_id),
    CONSTRAINT fk_card_members_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_card_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Labels: Nhãn (tags) cho cards, thuộc board
CREATE TABLE IF NOT EXISTS labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    board_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_board_label UNIQUE (board_id, name),
    CONSTRAINT fk_labels_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- Bảng Card_Labels: Gán label cho card (many-to-many)
CREATE TABLE IF NOT EXISTS card_labels (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL,
    label_id INTEGER NOT NULL,
    CONSTRAINT unique_card_label UNIQUE (card_id, label_id),
    CONSTRAINT fk_card_labels_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_card_labels_label FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);

-- Bảng Checklists: Checklist trong card
CREATE TABLE IF NOT EXISTS checklists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    card_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_checklists_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- Bảng Checklist_Items: Các item con trong checklist
CREATE TABLE IF NOT EXISTS checklist_items (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    CONSTRAINT fk_checklist_items_checklist FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE
);

-- Bảng Comments: Bình luận trên card
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Attachments: Tệp đính kèm cho card
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachments_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- Bảng Activities: Lịch sử hoạt động (audit log)
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL,
    card_id INTEGER,
    user_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    CONSTRAINT fk_activities_card FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
    CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Thêm indexes để tối ưu query
CREATE INDEX idx_boards_owner ON boards(owner_id);
CREATE INDEX idx_boards_visibility ON boards(visibility);
CREATE INDEX idx_board_members_board ON board_members(board_id);
CREATE INDEX idx_board_members_user ON board_members(user_id);
CREATE INDEX idx_columns_board ON columns(board_id);
CREATE INDEX idx_columns_position ON columns(board_id, position);
CREATE INDEX idx_cards_board ON cards(board_id);
CREATE INDEX idx_cards_column ON cards(column_id);
CREATE INDEX idx_cards_due_date ON cards(due_date);
CREATE INDEX idx_card_members_card ON card_members(card_id);
CREATE INDEX idx_card_members_user ON card_members(user_id);
CREATE INDEX idx_labels_board ON labels(board_id);
CREATE INDEX idx_card_labels_card ON card_labels(card_id);
CREATE INDEX idx_checklists_card ON checklists(card_id);
CREATE INDEX idx_checklist_items_checklist ON checklist_items(checklist_id);
CREATE INDEX idx_comments_card ON comments(card_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_attachments_card ON attachments(card_id);
CREATE INDEX idx_activities_board ON activities(board_id);
CREATE INDEX idx_activities_card ON activities(card_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_activities_action ON activities(action);

-- Insert sample data
INSERT INTO users (username, email, password_hash, full_name) VALUES
    ('admin', 'admin@trello.com', '$2b$10$example_hash', 'Admin User'),
    ('john_doe', 'john@example.com', '$2b$10$example_hash', 'John Doe'),
    ('jane_smith', 'jane@example.com', '$2b$10$example_hash', 'Jane Smith')
ON CONFLICT (email) DO NOTHING;

INSERT INTO boards (name, description, owner_id, visibility) VALUES
    ('Marketing Campaign', 'Quản lý chiến dịch marketing Q4 2024', 1, 'workspace'),
    ('Product Development', 'Quản lý phát triển sản phẩm', 2, 'private'),
    ('Team Tasks', 'Các nhiệm vụ hàng ngày của team', 3, 'public')
ON CONFLICT DO NOTHING;

INSERT INTO columns (name, board_id, position) VALUES
    ('To Do', 1, 0),
    ('In Progress', 1, 1),
    ('Review', 1, 2),
    ('Done', 1, 3),
    ('Backlog', 2, 0),
    ('Sprint 1', 2, 1),
    ('In Progress', 3, 0),
    ('Completed', 3, 1)
ON CONFLICT DO NOTHING;

INSERT INTO cards (name, description, board_id, column_id, due_date) VALUES
    ('Design banner ads', 'Thiết kế banner cho Facebook ads', 1, 1, '2025-01-15 18:00:00'),
    ('Write blog posts', 'Viết 5 bài blog về sản phẩm mới', 1, 1, '2025-01-20 18:00:00'),
    ('Setup Google Analytics', 'Cấu hình GA cho website', 1, 2, '2025-01-10 18:00:00'),
    ('User authentication', 'Implement login/logout', 2, 2, '2025-02-01 18:00:00'),
    ('Dashboard UI', 'Thiết kế giao diện dashboard', 2, 2, '2025-02-05 18:00:00'),
    ('Review PR #123', 'Code review cho pull request', 3, 1, '2025-01-05 18:00:00')
ON CONFLICT DO NOTHING;

INSERT INTO labels (name, color, board_id) VALUES
    ('Urgent', '#ef4444', 1),
    ('High Priority', '#f59e0b', 1),
    ('Medium Priority', '#10b981', 1),
    ('Feature', '#3b82f6', 2),
    ('Bug', '#ec4899', 2)
ON CONFLICT DO NOTHING;

INSERT INTO checklists (name, card_id) VALUES
    ('Pre-launch checklist', 1),
    ('Development tasks', 4)
ON CONFLICT DO NOTHING;

INSERT INTO checklist_items (name, checklist_id, completed) VALUES
    ('Create designs', 1, false),
    ('Get approval', 1, false),
    ('Upload to server', 1, false),
    ('Setup database', 2, true),
    ('Create API endpoints', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO comments (card_id, user_id, content) VALUES
    (1, 1, 'Bắt đầu thiết kế nhé team!'),
    (4, 2, 'Đã xong auth, next là dashboard')
ON CONFLICT DO NOTHING;

INSERT INTO activities (board_id, card_id, user_id, action, details) VALUES
    (1, 1, 1, 'card_created', '{"card_name": "Design banner ads"}'),
    (1, 2, 1, 'card_moved', '{"card_name": "Write blog posts", "from_column": "To Do", "to_column": "In Progress"}'),
    (2, 4, 2, 'card_assigned', '{"card_name": "User authentication", "assignee": "John Doe"}')
ON CONFLICT DO NOTHING;
