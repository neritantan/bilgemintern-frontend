@Library('bilgemintern') _

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t bilgemintern-frontend:latest .'
            }
        }
        stage('Test') {
            steps {
                sh '''
                docker network create frontend-net
                docker pull ghcr.io/neritantan/bilgemintern-backend:latest
                docker run -d --network frontend-net --network-alias backend --name frontend-backend ghcr.io/neritantan/bilgemintern-backend:latest
                docker run -d --network frontend-net --name frontend-app bilgemintern-frontend:latest
                sleep 30
                docker exec frontend-app wget -q -O- http://127.0.0.1/
                '''
            }
        }
        stage('Push') {
            steps {
                script {
                    env.HASH = shortHash()
                    pushToGhcr(image: 'bilgemintern-frontend', tag: env.HASH)
                }
            }
        }
    }
    post {
        always {
            sh '''
            docker stop frontend-app frontend-backend || true
            docker rm frontend-app frontend-backend || true
            docker network rm frontend-net || true
            docker rmi bilgemintern-frontend:latest || true
            '''
        }
        cleanup {
            cleanWs()
        }
    }
}
