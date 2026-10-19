# Vāc – AI Sanskrit Tutor and Pronunciation Coach

## Project Overview

Vāc is an AI-based Sanskrit learning application designed to help users learn Sanskrit through an interactive interface.

## Technologies Used

- React
- TypeScript
- Vite
- Node.js and npm
- Docker
- Jenkins

## Jenkins CI Pipeline

The Jenkins pipeline automates the following steps:

1. **Checkout:** Retrieves the source code from GitHub.
2. **Build:** Installs dependencies and builds the application.
3. **Test/Validate:** Checks whether the build output exists.
4. **Docker Build:** Creates a Docker image of the application.
5. **Result:** Displays the Docker image and reports the pipeline result.

## Run the Docker Application

The Jenkins-built Docker image can be run locally using:

```bash
docker run -d --name vac-sanskrit-tutor-test -p 8082:80 vac-sanskrit-tutor:5
```

Open `http://localhost:8082` in your browser to access the application when the container is running.

## Project Repository

Source code and CI/CD configuration are maintained in this GitHub repository.
