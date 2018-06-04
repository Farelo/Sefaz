stage 'Checkout'
 node('master') {
  deleteDir()
  checkout scm
 }
 
stage 'Build docker'
 node('master') {
     sh 'sudo docker-compose -f docker-compose.prod.yml up -d'
 }