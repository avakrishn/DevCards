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

- Web Dev Cards Landing Page

![Landing Page](https://raw.githubusercontent.com/avakrishn/Web-Dev-Cards/master/public/assets/images/readme/landing-page.png)

- From the Landing Page you have the option to Login or Register as a New User.

![Register](https://raw.githubusercontent.com/avakrishn/Web-Dev-Cards/master/public/assets/images/readme/register.png)

- Once logged in, your Homepage will contain all the decks you have created with their respective cards, which you can study or edit.

![Homepage](https://raw.githubusercontent.com/avakrishn/Web-Dev-Cards/master/public/assets/images/readme/home-page.png)

- You can study cards from the community deck or one of your created decks or my cards deck. 

- While studying you can easily add cards to one of your decks

- You can filter cards based on topic to study just specific topics from the community or my cards decks. 

![Community Deck](https://raw.githubusercontent.com/avakrishn/Web-Dev-Cards/master/public/assets/images/readme/community-deck.png)


- You can Create New Cards to add to your decks and to the community deck.

![Create New Cards](https://raw.githubusercontent.com/avakrishn/Web-Dev-Cards/master/public/assets/images/readme/create-cards.png)


## <a id="contributions"></a> Contributions By @avakrishn

- Designed and developed an interactive flashcard application and provided database DML, DDL, query support

- Enriched UI/UX  by creating dynamic and animated flashcards to allow for easy and repetitive studying

- Created filter feature for users to quickly and effortlessly find the most relevant flashcards for their needs

- Pages/Components/Routes:
    - Landing Page
    - Register Page
    - Homepage
    - Interactive Flashcards Pages 
        - Community, My Cards, single deck, and filtered deck
        - User can update and delete cards within the decks
    - Folder-like Side Navigation Pullout Tabs (Menu and Filter)
    - Filter Based on Topic Feature
    - Create a New Flashcards page 



- Other Contributors to Web Dev Cards:
    - @lawrenceslng
    - @tian3401


### **Future Code Development:**
* Source code will be developed over time to handle new features in the future.

### **Issues:**
* If you find an issue while using the app or have a request, <a href="https://github.com/lawrenceslng/Web-Dev-Cards/issues" target="_blank">log the issue or request here</a>. These issues will be addressed in a future code update.


