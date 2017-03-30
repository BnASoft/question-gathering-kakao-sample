# question-gathering-kakao-sample

## How to run this project

1. copy .env.example file to .env

<pre>cp .env.example .env</pre>

2. Put your own credentials in .env

### To deploy to bluemix

1. change the name of application in manifest.yml

2. push application to bluemix

<pre>cf push</pre>

### To run in local
<pre>
	npm install
	npm start
</pre>

## Download csv file of question list 

{your-public-url}/csv/questions
localhost:3000/csv/questions