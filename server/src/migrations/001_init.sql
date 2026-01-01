-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
  id SERIAL PRIMARY KEY,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO boards (title, description) VALUES
  ('My Project', 'Sample project board'),
  ('Personal Tasks', 'Personal task management')
ON CONFLICT DO NOTHING;

INSERT INTO columns (board_id, title, order_index) VALUES
  (1, 'To Do', 0),
  (1, 'In Progress', 1),
  (1, 'Done', 2)
ON CONFLICT DO NOTHING;

INSERT INTO cards (column_id, title, description, order_index) VALUES
  (1, 'Setup project', 'Initialize the project structure', 0),
  (1, 'Design database', 'Create database schema', 1),
  (2, 'Implement API', 'Build REST API endpoints', 0)
ON CONFLICT DO NOTHING;
