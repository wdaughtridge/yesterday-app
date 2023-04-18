# yesterday-app
Submit Spark jobs to containerized standalone Spark instances via web interface

Before you can get things going, build the Spark container from the Dockerfile in `/spark`. The server uses this image to orchestrate clusters to run PySpark jobs.

To build the main server container in the root directory, make sure to run `npm run build` in `/client` first to get the static React elements in the output directory. Once the frontend is built, you can build the main container in the root folder.

To run the main container for server:
`docker run -v /var/run/docker.sock:/var/run/docker.sock --rm -it -p 3000:3000 server:latest`

If you don't want to run the server in a container (like for development), run `npm run dev` from the `/server` folder.

Once you have either 1) the server container running, or 2) the `npm run dev` going, access `localhost:3000` in your browser and you will see 

A video demo for getting the Node server going and using the app can be found here: https://youtu.be/bzJES890Sho