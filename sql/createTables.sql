create table if not exists developers (
	"id" SERIAL primary key,
	"name" VARCHAR(50) not null,
	"email" VARCHAR(50) not NULL
);

CREATE TABLE IF NOT EXISTS developer_infos (
    "id" SERIAL PRIMARY KEY,
    "developerSince" DATE NOT NULL,
    "preferredOS" OS NOT NULL,
    "developerId" INTEGER UNIQUE NOT NULL,
    FOREIGN KEY ("developerId") REFERENCES developers ("id") on delete CASCADE
);

create table if not exists projects (
	"id" SERIAL primary key,
	"name" VARCHAR(50) not null,
	"description" text,
	"estimatedTime" VARCHAR(20) not null,
	"repository" VARCHAR(120) not null,
	"startDate" DATE not null,
	"endDate" DATE,
	"developerId" INTEGER,
	foreign key ("developerId") references developers ("id") on delete set null
);

create table if not exists technologies (
	"id" SERIAL primary key,
	"name" VARCHAR(30) not NULL
);

INSERT INTO technologies ("name") VALUES 
    ('JavaScript'),
    ('Python'),
    ('React'),
    ('Express.js'),
	('HTML'),
	('CSS'),
	('Django'),
	('PostgreSQL'),
    ('MongoDB');

create table if not exists projects_technologies (
	"id" SERIAL primary key,
	"addedIn" DATE not null,
	"technologyId" INTEGER not null,
	"projectId" INTEGER not null,
	foreign key ("technologyId") references technologies ("id") on delete cascade,
	foreign key ("projectId") references projects ("id") on delete cascade 
);