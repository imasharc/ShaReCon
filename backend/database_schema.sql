-- Create Account table
CREATE TABLE IF NOT EXISTS Account (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255)
);

-- Create Post table
CREATE TABLE IF NOT EXISTS Post (
    id SERIAL PRIMARY KEY,
    text_content TEXT NOT NULL,
    user_id INTEGER REFERENCES Account(id) ON DELETE CASCADE,
    created_at VARCHAR(100) NOT NULL,
    updated_at VARCHAR(100) NULL
);

-- Create Comment table
CREATE TABLE IF NOT EXISTS Comment (
    id SERIAL PRIMARY KEY,
    text_content TEXT NOT NULL,
    user_id INTEGER REFERENCES Account(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES Post(id) ON DELETE CASCADE,
    created_at VARCHAR(100) NOT NULL,
    updated_at VARCHAR(100) NULL
);

-- Insert sample account record
INSERT INTO Account(firstname, lastname, email, username, password, token)
VALUES ('mike', 'mike', 'mike@gmail.com', 'mike', '$2a$10$qFds7dO4./5wCVHzJl81EuCRlQghbzHQVv8XdgW4QkAvhOZp04RfK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWlrZSIsImlhdCI6MTcwMDQwMjA5MywiZXhwIjoxNzAwNDA5MjkzfQ.w77xNmY32e00MQI68SvI2ry23-ZcBkO7_1KC3yXoMGg');

-- Insert sample post record
INSERT INTO Post(text_content, user_id, created_at, updated_at)
VALUES('Make Autonomous Driving Finally Great!', 1, TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'), null);

-- Insert sample comment record
INSERT INTO Comment(text_content, user_id, post_id, created_at, updated_at)
VALUES('Openpilot is the future!', 1, 1, TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'), null);

-- Add column with profile picture to Account table
ALTER TABLE Account ADD COLUMN profile_picture VARCHAR(255) NULL; 