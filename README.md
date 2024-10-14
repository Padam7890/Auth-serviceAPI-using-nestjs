# Authentication service

This repository contains an authentication service built using NestJS, implementing both JWT and 2-factor authentication.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [License](#license)

## Features

- **JWT Authentication**: Secure token-based authentication using JSON Web Tokens.
- **2-Factor Authentication**: Enhanced security with two-factor authentication.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: TypeScript is a superset of JavaScript that compiles to clean JavaScript output.
- **JWT**: JSON Web Token for secure token-based authentication.
- **Two-Factor Authentication**: Implementing an additional security layer for authentication.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Padam7890/Auth-serviceAPI-using-nestjs.git
    cd auth-microservice
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create an `.env` file and configure your environment variables (see [Configuration](#configuration)).

4. Run the development server:
    ```bash
    npm run start:dev
    ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="Your database Url"
JWT_SECRET_KEY="your secret key"
```

## Usage

To use this authentication microservice, you can access all endpoints using the `/api` route. Detailed API documentation is available via Swagger.

1. Start the server:
    ```bash
    npm run start
    ```

2. Open your browser and navigate to `http://localhost:3000/api` to access the Swagger documentation.

## Credit

Made by Padam Thapa.  
[https://padamthapa.com.np/](https://padamthapa.com.np/)



