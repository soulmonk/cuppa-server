create table transaction_type
(
    id          serial      not null
        constraint transaction_type_pk
            primary key,
    name        varchar(32) not null,
    description varchar(128),
    user_id     integer     not null
);

create index transaction_type_user_id_index
    on transaction_type (user_id);

create table bank
(
    id      serial      not null
        constraint bank_pk
            primary key,
    name    varchar(64) not null,
    url     varchar(256),
    user_id integer     not null
);

create index bank_user_id_index
    on bank (user_id);

create table card
(
    id            serial                      not null
        constraint card_pk
            primary key,
    name          varchar(64)                 not null,
    valid_from    timestamp without time zone not null,
    valid_to      timestamp without time zone not null,

    currency_code varchar(3)                  not null,
    bank_id       integer                     not null
        constraint card_bank_id_fkey
            references bank
            on update cascade,
    description   varchar(256),
    user_id       integer                     not null
);

create index card_user_id_index
    on card (user_id);

create table transaction
(
    id            serial                      not null
        constraint transaction_pk
            primary key,
    date          timestamp without time zone not null default now(),
    description   varchar(64)                 not null,
    amount        double precision            not null,

    type_id       integer                     not null
        constraint transaction_type_id_fkey
            references transaction_type
            on update cascade,
    note          varchar(128)                not null default '',

    currency_code varchar(3)                  not null,

    card_id       integer
        constraint transaction_card_id_fkey
            references card
            on update cascade,

    invalid       boolean                     not null default false,
    user_id       integer                     not null
);

create index transaction_user_id_index
    on transaction (user_id);

create table transaction_info
(
    id             serial           not null
        constraint transaction_info_pk
            primary key,
    blocked_amount double precision not null,
    fixed_amount   double precision not null,

    transaction_id       integer
        constraint transaction_id_fkey
            references transaction
            on update cascade
);
