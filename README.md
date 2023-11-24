# Library Management System

![Library Management System Logo/Image]

## Overview

The Library Management System is an online platform built using MongoDB, Express.js, and Node.js. It is designed to efficiently manage library resources, including books, users, and administrators. The system supports key functionalities such as borrowing, creating, renewing, and returning books. Authentication ensures secure access, and additional features include comments and an activity tracker.

## Table of Contents

- [Postman Collection](#postman-collection)
- [Features](#features)

## Postman Collection

Explore the [Postman Collection](https://www.postman.com/mission-cosmonaut-25659827/workspace/library-management-system/collection/26177748-966f1dfc-34da-4377-bfa7-582ff08e8c80?action=share&creator=26177748&active-environment=26177748-4a1e9e7b-77c7-44fa-ab29-188a90c24d3d) for easy integration and testing.

# Features

### Borrowing System

- Users can borrow up to 5 books.
- Each user has a 7-day period to return a book; otherwise, a violation flag is triggered, resulting in fines.

### Book Management

- Only admins can add new books to the system.

### Renewal and Return

- Users can renew or return a book within the specified borrowing period.

### Authentication

- **Signup:** Users can create an account.
- **Login:** Secure login using JWT.
- **Logout:** Users can log out of their accounts.
- **Forget Password:** Password recovery through email.
- **Reset Password:** Users can reset their passwords securely.
- **Update Password:** Users have the option to update their passwords.

### Comments

- Users can add, update, and delete comments on books.

### Activity Tracker

- Tracks user actions such as issuing, returning, renewing books, and updating user profiles.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

GitHub : [Ahmed Sayed](https://github.com/unRealAhmed)
