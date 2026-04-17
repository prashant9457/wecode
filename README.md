# WeCode

WeCode is a full-stack platform for coding enthusiasts to connect, share activity, and track progress across competitive programming platforms like LeetCode and Codeforces.

## Database Schema

This project uses PostgreSQL (via Supabase) as the primary database. The schema ensures data integrity, limits platforms natively via ENUM-like checks, and optimizes feed queries using targeted indexing.

### `users`
Core authentication and profile data. Access is controlled via backend JSON Web Tokens (JWT).
- `id` (UUID, Primary Key)
- `username` (VARCHAR 50, UNIQUE)
- `email` (VARCHAR 100, UNIQUE)
- `password_hash` (TEXT, hashed locally via bcrypt)
- `is_verified` (BOOLEAN, default false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `coding_profiles`
Maintains user integrations with third-party competitive programming sites. Restricted tightly so users can only link verified platforms.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id`, CASCADE)
- `platform` (VARCHAR 20, enforces 'leetcode' or 'codeforces')
- `platform_username` (VARCHAR 100)
- `last_synced_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
*Note: A unique constraint exists on `(user_id, platform)` so users cannot link multiple accounts for the same platform.*

### `problems`
A global dictionary of coding problems across platforms so that `submissions` references a normalized problem structure.
- `id` (UUID, Primary Key)
- `platform` (VARCHAR 20)
- `problem_slug` (VARCHAR 150)
- `title` (TEXT)
- `difficulty` (VARCHAR 20)
- `created_at` (TIMESTAMP)
*Note: Unique constraint on `(platform, problem_slug)`.*

### `submissions`
Tracks individual successful solutions to problems by users. 
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id`, CASCADE)
- `problem_id` (UUID, Foreign Key → `problems.id`, CASCADE)
- `solved_at` (TIMESTAMP)
*Note: Indexed for rapid feed aggregation.*

### `friends`
Facilitates the social network aspect of the platform.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id`, CASCADE)
- `friend_id` (UUID, Foreign Key → `users.id`, CASCADE)
- `created_at` (TIMESTAMP)
*Note: Unique constraint on `(user_id, friend_id)`, and a self-referencing check constraint prevents a user from befriending themselves.*

### Relationships & Flow
- Users tie one-to-many to `coding_profiles` for platform linking.
- When an external cron or trigger pulls activity, it logs raw problems into the `problems` table, mapping the success events into `submissions`.
- The Activity Feed is entirely dynamic: rather than maintaining an `activity_feed` side-table, the backend queries the `submissions` of users found via the `friends` relation dynamically, ensuring complete synchronization. 
