CREATE DATABASE lexsport;
USE lexsport;

CREATE TABLE IF NOT EXISTS `workers`
(
    id          varchar(40)  NOT NULL,
    first_name  varchar(50)  NOT NULL,
    last_name   varchar(50)  NOT NULL,
    email       varchar(50)  NOT NULL,
    password    varchar(255) NULL,
    role_admin  tinyint(4)   NOT NULL DEFAULT '0',
    create_date timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;


CREATE TABLE IF NOT EXISTS `products`
(
    id          varchar(40)  NOT NULL,
    name        varchar(50)  NOT NULL,
    description varchar(255) NOT NULL,
    price_low   int(11)      NOT NULL,
    price_high  int(11)      NOT NULL,
    create_date timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

CREATE TABLE IF NOT EXISTS `activities`
(
    id          varchar(40)  NOT NULL,
    worker_id   varchar(40)  NOT NULL,
    product_id  varchar(40)  NOT NULL,
    name        varchar(50)  NOT NULL,
    description varchar(255) NOT NULL,
    create_date timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (worker_id) REFERENCES `workers` (id),
    FOREIGN KEY (product_id) REFERENCES `products` (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
