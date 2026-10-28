-- Up Migration
-- validation.js gives friendly errors; these constraints are the safety net.
-- "year at most next year" changes over time, so it is checked in JavaScript only.
CREATE TABLE cars (
  id    integer      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  make  varchar(100) NOT NULL CHECK (btrim(make) <> ''),
  model varchar(100) NOT NULL CHECK (btrim(model) <> ''),
  year  integer      NOT NULL CHECK (year >= 1886)
);

-- Down Migration
DROP TABLE cars;
