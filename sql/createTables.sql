create table if not exists developers (
	"id" SERIAL primary key,
	"name" VARCHAR(50) not null,
	"email" VARCHAR(50) not NULL
);

CREATE TABLE IF NOT EXISTS developer_info (
    "id" SERIAL PRIMARY KEY,
    "developerSince" DATE NOT NULL,
    "preferredOS" OS NOT NULL,
    "developerId" INTEGER UNIQUE NOT NULL,
    FOREIGN KEY ("developerId") REFERENCES developers ("id")
);