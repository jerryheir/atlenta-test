# Atlenta Frontend

This is the Atlenta Frontend project, a React-based application that utilizes modern libraries like Chakra UI, React Query, and Vite for an optimized development experience.

## Table of Contents

- [Atlenta Frontend](#atlenta-frontend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
    - [Development Server](#development-server)
    - [Build](#build)
    - [Preview](#preview)
  - [Technologies Used](#technologies-used)
  - [Environment Variables](#environment-variables)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jerryheir/atlenta-test.git
   cd atlenta-frontend

   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up your environment variables by copying .env.example to .env and configuring it with your Base URL for development:
   ```
   cp .env.example .env
   ```

## Available Scripts

In the project directory, you can run the following scripts:

Start the development server with hot-reloading:

```
npm run dev
# or
yarn dev
```

Compile and bundle the project for production:

```
npm run build
# or
yarn build
```

Locally preview the production build::

```
npm run preview
# or
yarn preview
```

## Technologies Used

React: A JavaScript library for building user interfaces.  
Vite: A fast build tool for modern web projects.  
Chakra UI: A simple, modular, and accessible component library for React.  
React Query: A powerful data-fetching library for React.  
Formik: A form library for React that provides easy form management.  
Yup: A schema validation library.  
Framer Motion: A library for animation in React.  
React Router: Declarative routing for React.

## Environment Variables

Make sure to create a .env file in the root of your project with the necessary environment variables. Below is an example of what this might look like:

```
VITE_API_BASE_URL=http://localhost:8080
```
