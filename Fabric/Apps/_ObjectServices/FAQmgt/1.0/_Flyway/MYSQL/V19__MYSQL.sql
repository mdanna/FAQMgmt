ALTER TABLE `FAQ`
	CHANGE `aswear` `answer` VARCHAR(2000),
	ADD `answerUserEmail` VARCHAR(40),
	ADD `answerUserName` VARCHAR(40),
	ADD `questionUserEmail` VARCHAR(40),
	ADD `questionUserName` VARCHAR(40);
