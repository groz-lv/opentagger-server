CREATE TABLE `cache` (
    `user` VARCHAR(20) NOT NULL,
    `subreddits` TEXT NOT NULL,
    `epoch` TEXT NOT NULL,
    PRIMARY KEY (`user`)
)