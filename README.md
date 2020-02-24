# Kossan Admin

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.7.

## Requirements

To install packages you need to install nodejs v10+, which will also install the nodejs package manager (npm).
https://nodejs.org/en/download/

The project uses yarn to download and install packages. Download and install yarn.
https://classic.yarnpkg.com/en/docs/install#windows-stable

Since this is an angular project we use angular cli to run the project locally.
Run `npm install -g @angular/cli` to install it globally.

I recommend using Visual Studio Code as editor.
https://code.visualstudio.com/download

## Project structure

src
    /app
        /admin - Folder containing the admin-ui (that allows an admin to create bookable dates, add accounts etc.)
        /auth - Authentication guard for accessing the web page
        /dashboard - View for bookable dates
        /firebase - Models and service for updating database
        /layout - Main component for rendering tool bar and dashboard
        /material - Module for importing material components
        /routing - Application routes
        /toolbar - Well, the toolbar
    /assets
        /images - Images used in the project
        /styles - Colors, mixins and material theme and style overrides

## Using git

The project uses git as versioning system, and if you like that you could use it as well. 

## Development server

Run `yarn` to install packages.

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy

Today I use FileZille to FTP the files in the `dist/` directory to the webserver. This can probably be done more smoothly by using some other tool, but this works for me.
https://filezilla-project.org/

