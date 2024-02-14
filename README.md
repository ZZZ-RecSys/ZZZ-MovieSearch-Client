# ZZZ - Movie Recommender App
![image](https://github.com/ZZZ-RecSys/ZZZ-MovieSearch-Client/assets/18610590/211c3c31-7c9e-47b9-81ef-5210c4f1ed73)


We followed the instructions at https://aiven.io/developer/building-a-movie-recommender

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This repository facilitates the integration of a comprehensive movie dataset from Kaggle into a PostgreSQL database, setting the foundation for a sophisticated movie recommendation system. Visit the [ZZZ-MovieRecSystem](https://github.com/ZZZ-RecSys/ZZZ-MovieRecSystem) to populate your database.

## Getting Started

# Project Setup Guide

This guide walks you through setting up a Node.js application that connects to a PostgreSQL database using environment variables for configuration.

## Prerequisites

- Node.js and npm installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

## Setup Instructions

### Step 1: Install Node.js

Ensure Node.js (which includes npm) is installed on your system. You can verify by running `node -v` and `npm -v` in your terminal.

### Step 2: Initialize Project

Navigate to your project's root directory in the terminal and install dependencies:

```bash
cd /path/to/your/project
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root with the following content:

```bash
PG_NAME=<your_database_name>
PG_PASSWORD=<your_database_password>
PG_HOST=<your_database_host>
PG_PORT=<your_database_port>
```

### Step 4: Download SSL Certificate
- Download the certificate `ca.pem` from [https://console.aiven.io/] and place it in your project.

### Step 5: Populate the PostgreSQL Database

Before running the development server, ensure your PostgreSQL database is populated with the initial dataset, located in [ZZZ-MovieRecSystem](https://github.com/ZZZ-RecSys/ZZZ-MovieRecSystem)

### Step 6: Run Development Server
Start the development server with:

```bash
npm run dev
```

### Step 7: Access the Application
With the development server running, access your application through the browser at [http://localhost:3000](http://localhost:3000)


## Additional Information
Ensure your database client uses SSL/TLS with `ca.pem`.

