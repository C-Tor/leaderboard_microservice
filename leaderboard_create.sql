--runs

--reset database
DROP TABLE IF EXISTS runs;

CREATE TABLE runs (
  run_id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(64) NOT NULL,
  rtime DOUBLE(11, 5) UNSIGNED,
  PRIMARY KEY (run_id)
);

INSERT INTO runs (name, rtime) VALUES ("test run", 3.25323);
