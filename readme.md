# Web Dev Cards
## Community Driven Flashcard Application
###  <a href="https://web-dev-cards.herokuapp.com/home" target="_blank">Access Web Dev Cards Here</a> 

## Contents
* [Overview](#overview)
* [Technology Used](#tech)
* [Get Started](#start)
* [Demo](#demo)
* [Contributions](#contributions)


## <a id="overview"></a> Overview

- Web Application that promotes the growth and advancement of novie and expert web developers.

- Web Dev Cards allows developers of all different levels to learn from and teach each other while growing their skills as web developers.

- Users create accounts and then are able to create or edit their own flashcards and decks, study the community flashcard deck or their own decks, and filter through flashcards by technology.


## <a id="tech"></a> Technology Used

- Javascript
- jQuery
- Node.js
- Express.js, 
- EJS
- SQL
- MySQL
- HTML 
- CSS
- Bootstrap

## <a id="start"></a> Get Started

- Clone This Repo:
```
    git clone git@github.com:avakrishn/Web-Dev-Cards.git
```

- Install NPM Package Dependencies:
```
    cd <your path to Web-Dev-Cards root directory>
    npm install
```

- Update Environment Variables:
    - Create a .env file in the root directory and add the following variables:

```
    DB_HOST = <your database hostname>
    DB_USER = <your database hostname>
    DB_PASSWORD = <your database password>
    DB_NAME = WebDevFlashcard_db
```

- Source SQL Schema and Seeds:
```
    SOURCE schema.sql
    SOURCE seed_user.sql
    SOURCE seed_cards.sql
```

- Run the App:
```
    cd <your path to Web-Dev-Cards root directory>
    node server
```


## <a id="demo"></a> Demo

- <a href="https://web-dev-cards.herokuapp.com/home" target="_blank">Access Web Dev Cards Here</a> 

- Web Dev Cards Homepage



### **Future Code Development:**
* Source code will be developed over time to handle new features in the future.

### **Issues:**
* If you find an issue while using the app or have a request, <a href="https://github.com/lawrenceslng/Web-Dev-Cards/issues" target="_blank">log the issue or request here</a>. These issues will be addressed in a future code update.


