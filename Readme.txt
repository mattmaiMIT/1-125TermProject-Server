[Edge] 

The edge device is a simulator on your local PC. 
It will connect to a server in Digital Ocean.
Put the files of the Edge folder onto your local PC.
To start, in the local PC terminal command window, give the command "npm start" (we've defined "start" as a key in the package.json) 
# in the code, you need to modify the IP connection to the project of your Digital Ocean.


[Server]

The server is hosted on the Degital Ocean
# You'll need to create a Digital Ocean project.
# For communication with the data base, you'll also need to create a project in the Docker hub, get the connection information, and modify it in the file "dbfunctions.js"

To connect to the server (your VS code to work in the Digital Ocean virtual machine environment), you will need to instalthe "Remote SSH" in the VS extension.
Then, you'll need your PC's public key be recognized by the server 
(Terminal command: ssh-keygen, and you can find it in id_rsa.pub file. Get the key, and add it to the Digital Ocean by 
1. open the Digital Ocean project console,
2. snap instal micro --classic
3. micro .ssh/authorized_keys
4. copy/paste the SSH key of your PC, save the file) 
  
You can copy the files of the Server folder to the virtual machine folder (or by gitclone)
You might neet to install some libraries and modules by giving the comments through the virtual machine's terminal
- npm init
- npm install express -s
- npm install body-parser
- npm install mysql2
- npm install ejs

Before you dockerized the image, to start the server, you can just give the command "npm start" in the virtual machine's terminal command window.
After dockerization, you can start the server by giving the command "npm run start-docker-container"

To dockerize the image and create the docker container, you can give the following commands, step by step, in the virtual machine's terminal command window
- npm run build-docker-image
- npm start-docker-container
* these keys are defined in the package.json


[Web browser]

When both the Edge device and the Server are activated, you can go to your IP:3001 (in the current case, http://159.223.186.14:3001/) to check the web UI.


**CONTACT**

Matt Mai
matthew6@mit.edu
12.02.2021


