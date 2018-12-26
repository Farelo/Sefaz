stage 'Checkout'
 node('develop') {
  deleteDir()
  checkout scm
 }

stage 'Build project in docker'
   node('develop') {
   sh 'sudo docker-compose build cebrace-frontend-web cebrace-backend-api cebrace-loka-api-job cebrace-state-machine-job'
 }