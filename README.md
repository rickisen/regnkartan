# Regnkartan

This is a weather App that visualizes data from the SMHI open data Api.
It's intended to be "map based" and to implement a more smart phone based UX
than other weather apps usually do.

The current version will only display historical and up to date data (Varying
from 5 to 60 minutes old data). So no future predictions in the weather yet.
Those APIs tend to cost a lot of money :'(

However this gives you the ability to train a intuition on how the
weather is likely to change during the day. And it gives a lot more
details on how the weather is right now than many oter apps.

Which could be very useful for practitioners of certain outdoor activities,
such as sailing and the like.

I have also created a kubernetes based micro service backend for this project
that (amongst ohter things) transforms radar images to the correct projection
to be used with google maps. And also packs a lot of these images into one request.
I can show it to you on request, but I am not yet comfortable to share it publicly.

## Purpose of sharing this project on GitHub

The reason I started this project was that I by chance discovered the existence
of the SHMI open data api, and felt that someone should make an app visualizing
this data. And so I did. Later I felt like I needed a better reason to make it,
So I figured that it could serve as a sample app for recruiters who wanted to
see an example of my skill.

## Technologies

This app is built using react-native and the expo framework. And to run it (as
a developer) you need to install the expo app on your phone, expo-cli on your
computer. And then scan the QR code displayed after running `yarn install; expo start` from the project folder.
