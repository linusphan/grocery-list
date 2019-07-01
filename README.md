<img width="826" alt="grocery_list_application" src="https://user-images.githubusercontent.com/13613724/60420765-58976b80-9b9d-11e9-81aa-434b3cb8d415.png">

# About

A grocery list application that is built using Backbone.js and Handlebars.js.
The application makes use of Backbone.js's features of multiple models and
collection.

# Features

* On page load, two models are created for existing items
* They are alphabetically sorted by name and rendered as table rows using
  Handlebars template
* Form used to create a new model, adds model to collection, and renders new
  item from template partial and append it to the table
* Form resets when model is created
* Has "delete all" link
* Table headings are clickable - table sorts based on that property
* Use local storage to persist data
