create database if not exists log430;
USE log430;

CREATE TABLE IF NOT EXISTS payload
(
	Topic VARCHAR(300) NOT NULL,
    P_CreateUtc DATETIME NOT NULL,
    P_Desc VARCHAR(100) NOT NULL,
    P_ExpiryUtc DATETIME NOT NULL,
    P_Status VARCHAR(100) NOT NULL,
    P_Unit VARCHAR(100) NOT NULL,
    P_Value VARCHAR(100) NOT NULL
);

