ALTER TABLE `Goals`
	DROP INDEX `42cdc1df33dc108e0aad3d1089641d`,
	MODIFY `goalsID` BIGINT NOT NULL AUTO_INCREMENT,
	ADD CONSTRAINT `42cdc1df33dc108e0aad3d1089641d` UNIQUE KEY(`goalsID`),
	DROP PRIMARY KEY,
	ADD PRIMARY KEY(`goalsID`);
