DROP DATABASE IF EXISTS WebDevFlashcard_db;
CREATE DATABASE WebDevFlashcard_db;
USE WebDevFlashcard_db;

-- table for all users (login system table)

CREATE TABLE users(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(30) NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR (255) NOT NULL, 
	email VARCHAR(100) NOT NULL, 
	password VARCHAR(100) BINARY NOT NULL,
	account_type ENUM('Student', 'Instructor', 'Administrator') NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (username),
	UNIQUE (email),
	PRIMARY KEY (id)
);

-- each user has a profile that they can store information (like a short bio, contact info); we can create another table and link it to the users table
CREATE TABLE userProfile(
	id INT NOT NULL AUTO_INCREMENT,
	users_id INT NOT NULL,
	last_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    biography TEXT,
	avatarPath VARCHAR(255),
	PRIMARY KEY (id),
	FOREIGN KEY (users_id) REFERENCES users(id)
);

-- table that holds all the cards (the category and subcategory that the card belongs to, front: question, back: answer, and how many votes each card gets from the community and the creator_id is the users_id of the person who created the card)
CREATE TABLE cards(
	id INT NOT NULL AUTO_INCREMENT,
	category VARCHAR (255) NOT NULL,
	front TEXT NOT NULL,
	back TEXT NOT NULL,
	difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
	votes INT DEFAULT 0,
	creator_id INT NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- CREATE TABLE subcategories(
--  id INT NOT NULL AUTO_INCREMENT,
--  cards_id INT NOT NULL,
--  subcategory VARCHAR(255) NOT NULL,
--  PRIMARY KEY (id),
--  FOREIGN KEY (cards_id) REFERENCES cards(id)
-- );

-- table holds all the decks (the users_id is the foreign key that links the deck to the user)
CREATE TABLE decks(
	id INT NOT NULL AUTO_INCREMENT,
	users_id INT NOT NULL,
	name VARCHAR (255) NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (users_id) REFERENCES users(id)
);

-- table inks the decks and the cards such that each deck can have multiple cards and each card can be used in multiple decks
CREATE TABLE deck_cards(
	decks_id INT NOT NULL,
	cards_id INT NOT NULL,
	FOREIGN KEY (decks_id) REFERENCES decks(id),
	FOREIGN KEY (cards_id) REFERENCES cards(id)
);

-- table that holds all the comments and references the user who created the comment and the card the comment if for
CREATE TABLE comments(
	id INT NOT NULL AUTO_INCREMENT,
	users_id INT NOT NULL,
	cards_id INT NOT NULL,
	comment TEXT NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (users_id) REFERENCES users(id),
	FOREIGN KEY (cards_id) REFERENCES cards(id)
);

CREATE TABLE filterCategories(
	users_id INT NOT NULL,
    category VARCHAR (255) NOT NULL,
	FOREIGN KEY (users_id) REFERENCES users(id)
);