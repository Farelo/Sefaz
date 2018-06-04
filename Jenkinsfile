stage 'Checkout'
 node('master') {
  deleteDir()
  checkout scm
 }
 
stage 'Build & Archive Apk'
 node('master') {
     sh 'docker-compose -f docker-compose.prod.yml up -d'
 }