> **GETTING STARTED:** You should likely start with the `/mock` folder from your solution code for the mock gearup.

# Project Details

Project Name: Mock
Team Members: wcpark, jpeng29
Estimated Time: 14 hours
REPO: https://github.com/cs0320-s24/mock-wcpark-jpeng29.git

# Design Choices

We have an interface REPLFunction that implements itself in every function that is created in the REPLInput function. This guarantees that everything is of type RELFunction so when other developers create new functions, as long as they implement REPLFunction in it then the program will function as normal. We used a Map to map functions to their corresponding string literal so that we can call commands by entering in their names in the commnand line.

To format our CSV we had a for each loop go through each CSV row and we added it as a string to a separate variable csvString. And when handleSubmit() is called, it checks if the command was "view", and if it was then it will add ...csvString to the history to format it nicely, where each row is labeled and on a new line.

# Errors/Bugs

When using a Map to map function names to functions, we first used a useState which gave us errors during runtime. We solved this by making a variable instead to hold the Map because the Map was not supposed to be changed during runtime in the first place so we put the values in beforehand for all of our existing functions.

# Tests

Our testing suite is contained in App.spec.ts. We added tests for each command the user could input and made sure the output is as expected. Comments are provided above each test explaining their functionality.

# How to

1. Run npm start
2. Click on the link: http:localhost/8000
3. Click Login
4. Type commands into the command input
5. Click submit to see the result displayed

# Collaboration

_(state all of your sources of collaboration past your project partner. Please refer to the course's collaboration policy for any further questions.)_
N/A
