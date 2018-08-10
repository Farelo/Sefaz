stage 'Checkout'
 node('master') {
  deleteDir()
  checkout scm
 }

 stage 'Delete old images'
   node('master') {
   sh 'sudo docker rmi $(docker images -q -a)'
 }

 stage 'Build project in docker'
   node('master') {
   sh 'sudo docker-compose build'
 }


stage 'Up project in docker'
 node('master') {
     sh 'sudo docker-compose up -d'
 }