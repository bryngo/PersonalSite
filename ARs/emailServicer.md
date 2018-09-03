# Architecture Review: Email Servicer
## Goal
I've always wanted my own domain. And I got one (`bryngo.me`). I've always wanted to send emails from said domain, and now it's time to do just that.

Another motivation for doing this is I want to use the node module `nodemailer` to send out emails. Of course, I can just do this with my gmail, but Google doesn't play nice with such 3rd party services. 

## Steps
1. Follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-run-your-own-mail-server-with-mail-in-a-box-on-ubuntu-14-04)
to figure out how to send emails from my server domain.
2. Install `nodemailer`
3. Done?

## Testing
1. After setting up the mail server, I'll manually send emails to myself.
2. Once I can verify the mail server work, I can look into connecting it
to the code. 
    - I can do this by just running the script found [here](https://www.w3schools.com/nodejs/nodejs_email.asp).
## Misc
- This AR isn't really an AR, honestly. It's just some documentation on what I'm doing to my server in case I need reference to it one day. 
