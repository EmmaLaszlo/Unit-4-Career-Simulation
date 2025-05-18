INSERT INTO users (username, email, password_hash) VALUES
('testuser', 'test@example.com', '$2a$10$xQH2.Nuj7.3F3T5Ud3gVqe2qxkH34PDGHtkduPlXq2rsA9D9ebqjW'),-- password123
('alice', 'alice@example.com', '$2a$10$xQH2.Nuj7.3F3T5Ud3gVqe2qxkH34PDGHtkduPlXq2rsA9D9ebqjW'); -- user_id = 2

INSERT INTO items (name, description) VALUES
('Coffee Shop', 'Local cafe'),
('Pizza Place', 'Popular pizza restaurant');

INSERT INTO reviews (user_id, item_id, score, body) VALUES
(1, 1, 5, 'Great coffee!'),
(2, 1, 4, 'Nice ambiance.'),
(1, 2, 3, 'Average pizza.');

INSERT INTO comments (user_id, review_id, body) VALUES
(2, 1, 'Agree!'),
(1, 2, 'Thanks!');