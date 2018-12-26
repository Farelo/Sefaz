stage 'Checkout'
 node('master') {
  deleteDir()
  checkout scm
 }

stage 'Build project in docker'
   node('master') {
   sh 'sudo docker-compose build cebrace-frontend-web cebrace-backend-api cebrace-loka-api-job cebrace-state-machine-job'
 }

stage 'Up project in docker'
   node('master') {
   sh 'sudo docker-compose up -d cebrace-frontend-web cebrace-backend-api cebrace-loka-api-job cebrace-state-machine-job'
}