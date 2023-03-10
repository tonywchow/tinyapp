# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). This app will take a regular URL and transform it into an encoded version, which redirects back to the original URL.

This project utilizes specific technologies such as:
- Web Server: Node.js
- Middleware: Express
- Template Engine: EJS


# Final Product:
Here is what the final web application looks like:

## Login Page:
!["Login Page"](./assets/images/Login.png)

## Register Page:
!["Register Page"](./assets/images/Register.png)

## URL List Page:
!["URL List Page"](./assets/images/List.png)

## Create New URL Page:
!["Create New URL Page"](./assets/images/NewURL.png)

## Edit Page:
!["Edit Page"](./assets/images/Edit.png)

## Dependencies:

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started:

- Install all dependencies using the ```npm install``` command.
- Run the web server using the ```npm start``` command.
- To register, go to: ```http://localhost:8080/register```.
- To log in, go to: ```http://localhost:8080/login```.
- Use the nagivation bar to:
  - Create new shorten URLs
  - Access list of URLs (must be logged in first)
- Utilize Edit and Delete buttons to update your URLs in My URLs