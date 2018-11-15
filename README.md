# ProTrip

## Target Audience
* Road trippers who want to want best local food options and the best gas prices across all of their pit stops.

## Problems Addressed
* Finding cheap gas prices while on a road trip is challenging if you don't have a gasbuddy app.
* Knowing the best local restaurants is tough when you are passing through a city, which leads to people usually eating from unhealthy fast food chains when road tripping.

## Primary Goal
* Google Maps and Apple Maps are helpful when you need to search food around you, but what about finding the best local food in your next pit stop 3 hours away? We wanted to help road trippers be able to plan ahead for these pit stops by enabling them to scout out the best local food options and cheapest gas prices at each stage of their journey.

## User Stories
* "ProTrip helped me save money at the gas pump during my road trip stops."
* "You won't believe the restaurant we found using ProTrip. The local, hole in the wall food was incredible. It was one of our favorite memories from the road trip."
* "ProTrip was so easy to use. We mapped out our stops, found restaurants we liked, and were able to call in reservations right from the app!"


<!-- User Experience -->
## User Experience
* Log in to lobby using a unique key
* User will Pick 3 fav songs
  * After picking the songs they will see a 30 sec countdown screen
* Then they will see question and answers to pick from and their score on the top
* Screen if answered right
* Screen if answered wrong
* Final page shows the final score
## Main Screen
* Play list to pick from with a countdown then after all users choose the songs
* Then after all users picking their fav songs
	* Playlist to show most clicked on top to least picked at the bottom
* Top nav bar 'Name of application'
* Mid section left side question to answer and answer choices
* Mid section right side leader board of top ten answered correctly 'Optional'
* Bottom left song playing at the moment 'player'
* Bottom right countdown for the show to start 'change animation when reach last 5 min or so'

# Programming logic
* Spotify API to get the playlist
* Second API 'TBD'
* Firebase database holder
* 2 HTML's one for the user screen one for the main screen
* Functions:
	* Functionality to sign in using a unique code
	* Functionality to get user Name/ID to store in the DB
	* Functionality to get user input/choice and store in th DB
	* Each user will have a main node with subnodes inside of it
		* Sub1 will be user name
		* Sub2 will be User playlist Pick
		* Sub3 will be User answer input
		* Sub4 will be User score
	* Function for right answer
	* Function for wrong answer
	* Function for timer based playlist pick if ends it will take to a '30 Sec waiting screen'
	* Function for player with playlist in
	* Function for leaderboard "for now optional"
	* Function for main countdown timer 'when will the band start playing'
	* Function to reset all inputs
	* Function for trivia game
