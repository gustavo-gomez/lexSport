CREATE DATABASE lexsport;
USE lexsport;

CREATE TABLE IF NOT EXISTS `workers`
(
    id          VARCHAR(40) NOT NULL,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    phone       VARCHAR(50)          DEFAULT NULL,
    user        VARCHAR(50)          DEFAULT NULL,
    password    VARCHAR(255)         DEFAULT NULL,
    role_admin  TINYINT(4)  NOT NULL DEFAULT '0',
    can_login   TINYINT(4)  NOT NULL DEFAULT '0',
    old_worker  TINYINT(4)  NOT NULL DEFAULT '0',
    create_date TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `products`
(
    id                VARCHAR(40)   NOT NULL,
    code              VARCHAR(40)   NOT NULL,
    name              VARCHAR(50)   NOT NULL,
    description       VARCHAR(255)           DEFAULT NULL,
    making_price_low  DECIMAL(5, 2) NOT NULL,
    making_price_high DECIMAL(5, 2) NOT NULL,
    fill_price        DECIMAL(5, 2)          default 0.00,
    create_date       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

CREATE TABLE IF NOT EXISTS `activities`
(
    id          VARCHAR(40)   NOT NULL,
    worker_id   VARCHAR(40)   NOT NULL,
    product_id  VARCHAR(40)   NOT NULL,
    quantity    TINYINT(40)   NOT NULL,
    action      VARCHAR(50)   NOT NULL,
    price       DECIMAL(5, 2) NOT NULL,
    date        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_date TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (worker_id) REFERENCES `workers` (id),
    FOREIGN KEY (product_id) REFERENCES `products` (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- updates

ALTER TABLE `activities`
    ADD submitter_id VARCHAR(40) NOT NULL AFTER `price`;

update activities
set submitter_id='16'
where action = 'make';

update activities
set submitter_id='17'
where action = 'fill';


ALTER TABLE `workers`
    ADD role VARCHAR(40) AFTER `password`;
