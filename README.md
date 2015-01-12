# Running Man

Running man is an app with basic functionality for runners to track their runs. The interface is geared towards viewing recent runs and tracking progress trends over time. Users can create an account, login, add/edit/delete entries, and view a date-range-filterable group of entries.

It makes use of Backbone, Requirejs, Bourbon/Neat, Pickadate.js,  and the Google Visualizations API on the front end. The back end is Ruby with Grape/Mongoid.

## Setup
Running Man assumes you have ruby 2.1.2, mongod, and redis-server running on the local machine.

To install rubygems:
    bundle install
Install npm packages:
    npm install
Install bower packages:
    bower install
Run up the app:
    foreman start

There is a rake script to load fake data for a demo user. To use it, register a test user and then in terminal run `rake db:fakedata`. This will add hundreds of random entries for the first user in the database.
