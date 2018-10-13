# My Personal Website

[![Build Status](https://travis-ci.org/bryngo/PersonalSite.svg?branch=master)](https://travis-ci.org/bryngo/PersonalSite)

## Running Locally
This source code assumes a couple things
- You have a mongo database named `Lightning`
  - To get this set up, run `use Lightning` from the mongo CLI
- You have the followings collections in mongo
  - `accounts`
  - `anime`
  - `anime_ep`
  - `chest`
  - `vairables`
  - `wallposts`

Each of the collections can be created by typing `db.createCollection({'NAME'})`. Be sure you are using the `Lightning` database. 

## Tech Stack
### Client Side
    - HTML/CSS/JS
### Server Side
    - Node.js
    - Express
    - MongoDB
    - Jade

## Views
### /
- This is the home page of the website.
- Visitors can post a message on a comment wall, provided the user enters a
name, email, and message.

### /blog
- Landing page for future blogs.

### Future Plans / Development
#### Message Wall
- Add additional functionality server side to filter out nasty messages
- Prevent bots from crashing the site (by entering too much data).
#### Blog
- Add an interface for myself to write blog posts without needing to write
any Jade/HTML. Said blogs would be queryed from my MongoDB before rendering a
page.
- Begin working on the tech blog, which focuses on academic-related writing,
or UC Davis specific things.
- Add an anime watch list section
- Add a piano sheet music list
#### Misc
- Add a 404 page


## Acknowledgements
- The tech stack for this website is an adaptation from 
[this](https://github.com/BCNC/bcnc.github.io) project that I am working on.
The original developer for the stack is [Vincent Yang](https://vincentyang.me)
- The design for the website are variations / combinations of templates created
by [html5up](https://html5up.net).
