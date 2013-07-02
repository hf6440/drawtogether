Draw Together
============
This is a project that based on Express, Node.JS and Socket.IO. Goal of this project is a web-based game allow two players to draw on a canvas and see what is the other player drawing in real-time.

Users can access the server though a url. In local network, you can access the application through "http://localhost:3000/canvas".

================================================================================================
June 29 2013 -	You can draw on the canvas on "http://localhost:3000/canvas" if you run the app.js on server.
		You can see black line on the canvas when you draw. In fact, this is not done locally. It sent the coordinate of where your mouse passed to server, and the server sent it back and draw lines on canvas according to recieved coordinates.
		So, communication between web-page and server has already been realized and it can draw according to the recieved message. Next step would be adding another client in this interaction.
		
June 30 2013 - 	Users can access the white board and draw together on it now. 
		users can erase the whole whiteboard. 
		It will notice users about logging in and logging out of other users.
		(Please be aware of that the webpage will link to the server at 'http://localhost'. If you want to access the board from outside of the server, please change the address in the canvas.html. Thanks.)

July 01 2013 -  Fixed some bugs in simultaneously drawing. 
		Add when a new user joined, new user can see what has already been drawn on the board. This is like that someone came into a classroom and he could see what was written on the whiteboard by other students. And, if nobody cleaned the board when they left the classroom, next student who came into this classroom would see what left on the whiteboard.  
		Use a table beneath the canvas to show notice, instead of the annoying "alert()".

July 02 2013 -	Added garbage collection (Step 1) on both server and client to improve the efficiency when a large number of users are accessing the whiteboard.
		Fixed style of part of the code.

Next Step    -	Explore method to achieve higher efficiency. Then pack code into modules..

================================================================================================
Envoirment: Windows 7, WebStorm - 6.0.2, Express - 3.3.1, Node.JS - v0.10.5, Socket.IO - 0.9.16.
Browser I used: Chrome 25.0.1364.160 m, Firefox 21 and 22.
