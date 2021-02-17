# My First Meme Generator

## Group members
Christina Sedlmeier, Laura Gräber, Pia Hammer, Sina Schnebelt

## How to start the app
1. Navigate to the folder `OMMExercise1`.
2. Install the necessary dependencies by running `npm install`.
3. Open a separate terminal window and navigate to the `OMMExercise1/backend` directory. Install all the necessary backend dependencies by running `npm install`.
4. Inside `OMMExercise1/backend` run `npx nodemon --legacy-watch bin/www` to start the server process. Every time a file in `/backend` changed, the server process will now restart automatically.
5. Open a third terminal window and start mongoDB by using this command `brew services start mongodb-community`. This works only if you installed MongoDB via Homebrew which is recommend. See section [Installing MongoDB with Homebrew and its set up](##installing-mongodb-with-homebrew-and-its-set-up) and [Run MongoDB](##run-mongodb).
6. In the first terminal window, which should be in the `OMMExercise1` directory execute `npm start`. The command will start the development server.
7. Now the application will start the development server automatically and will be accessed via `localhost:3000` in the browser.

## Installing MongoDB with Homebrew and its set up
1. `brew tap mongodb/brew`<sup>1</sup> <sup>2</sup> 
2. `brew install mongodb-community` 
3. Create the data directory<sup>3</sup> . Before you start MongoDB for the first time, create the directory to which the mongod process will write data. By default, the mongod process uses the `/data/db` directory. If you create a directory other than this one, you must specify that directory which we will do in point.
4. Create the directory `db` with this path `OMM1Exercise/backend/data/db`. I added `backend/data/` to the `.gitignore` file so the testing data saved in the database is not uploaded to github.
5. Run `ps -xa | grep mongod` in your terminal to find out where your mongod configuration file is located (in my case it is located here: `/usr/local/etc/mongod.conf`)
6. I opened that MongoDB config file from the terminal via `open -a "Sublime Text" /usr/local/etc/mongod.conf`.
7. Change `dbpath` so it contains the path where you store the git folder for the project. 
![mongod.conf](/src/Images/mongodconf.png?raw=true)

<sup>1</sup>https://stackoverflow.com/questions/57856809/installing-mongodb-with-homebrew <br></br>
<sup>2</sup>https://github.com/mongodb/homebrew-brew <br></br>
<sup>3</sup>Those are the instructions vor MacOS Catalina using homebrew to start mongoDB for other ways of using MongoDB there are further instructions online. <br></br>

## Run MongoDB with Homebrew
* You can run MongoDB as a macOS service using brew, or you can run MongoDB manually as a background process. It is recommended to run MongoDB as a macOS service, as doing so sets the correct system ulimit values automatically.<sup>4</sup>
* To run MongoDB (i.e. the mongod process) as a macOS service and stop it when exiting the application:
  *	brew services start mongodb-community
  *	brew services stop mongodb-community
<br></br><sup>4</sup>https://github.com/mongodb/homebrew-brew


## Steps to check if the application uses the database correctly:
1.	Follow the steps in [How to start the app](##how-to-start-the-app)
2.	Start `mongod` and open the command-line shell `mongo` which connects to a specific instance of mongod (A nice explanation about `mongod` and `mongo` can be found here https://stackoverflow.com/questions/4883045/mongodb-difference-between-running-mongo-and-mongod-databases)
3.	Got to the applications which runs on `localhost:3000` in the browser and click on `Save meme`.
4.	Go to the MongoDB shell (see screenshot below) by typing `mongo` and press enter.
5.	`show dbs` shows you all the databases. The database `memes` was created via the `samplememes.js` file.
6.	Switch to that database with `use memes`.
7.	`show collections` and with `db.memes.find()` check if there is an entry for the image + text which you saved in the database by clicking on `Save meme` in the app.
![mongod.conf](/src/Images/checkdatabase.png?raw=true)

If you are wondering why it shows 0.000GB even after inserting data: https://stackoverflow.com/questions/35607426/my-mongodb-shows-as-0-000gb-even-after-inserting-the-data.



## Further information

### Nodemon
Nodemon was introduced, because it is used to monitor any changes in the source code. It automatically restarts the server when any change is found which makes development a lot more convenient.

### Nice explanation about using a database with Mongoose
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
https://kb.objectrocket.com/mongo-db/create-react-app-with-mongodb-part-2-building-the-backend-900

