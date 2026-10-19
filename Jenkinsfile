
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code retrieved from GitHub.'
            }
        }

        stage('Build') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'npm ci --legacy-peer-deps'
                bat 'npm run build'
            }
        }

        stage('Test/Validate') {
            steps {
                bat 'if not exist dist\\index.html exit /b 1'
                echo 'Build output validated successfully.'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t vac-sanskrit-tutor:%BUILD_NUMBER% .'
            }
        }

        stage('Result') {
            steps {
                bat 'docker images vac-sanskrit-tutor'
                echo 'All pipeline stages completed successfully.'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Vāc CI pipeline passed.'
        }
        failure {
            echo 'FAILURE: Check Console Output for the failed stage.'
        }
    }
}
