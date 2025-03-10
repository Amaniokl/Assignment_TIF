# Assignment_TIF
# Community Management API

This project is a Community Management API built with Node.js, Express, and MongoDB. It allows users to create and manage communities, roles, and memberships.

## Features

- User authentication (signup, signin, logout)
- Create and manage communities
- Add and remove members from communities
- Create and manage roles
- Pagination support for listing communities and roles

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- dotenv for environment variable management
- Snowflake for unique ID generation
- slugify for creating URL-friendly slugs

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/community-management-api.git
   cd community-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```plaintext
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup`: Register a new user
- `POST /api/v1/auth/signin`: Login a user
- `GET /api/v1/auth/me`: Get current user info (protected)
- `POST /api/v1/auth/logout`: Logout a user

### Communities

- `POST /api/v1/communities`: Create a new community (protected)
- `GET /api/v1/communities`: Get all communities with pagination (protected)
- `GET /api/v1/communities/member/:id`: Get members of a specific community (protected)
- `GET /api/v1/communities/me/owner`: Get communities owned by the authenticated user (protected)
- `GET /api/v1/communities/me/member`: Get communities the authenticated user has joined (protected)

### Members

- `POST /api/v1/members`: Add a member to a community (protected)
- `DELETE /api/v1/members/:id`: Remove a member from a community (protected)

### Roles

- `POST /api/v1/roles`: Create a new role (protected)
- `GET /api/v1/roles`: Get all roles with pagination (protected)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
