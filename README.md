# Dogie Bot

<img src="./assets/dogie.jpg" alt="Dogie" width="450" height="250"/>

Dogie Bot!

A discord chat bot with economy system, gambling, and a plethora of useful and/or fun commands.

Made for private Discord server.

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Features](#features)
- [Todo](#todo)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- [Node.js](https://nodejs.org/en/) - At least Version 22.12.0
- [npm](https://www.npmjs.com/)

## Setup

After ensuring you have all the requirements, continue with these steps.

### Installation

```bash
# Clone repository
git clone https://github.com/ZaydenGit/dogie-bot.git

# Enter the repository
cd dogie-bot/

# Install the packages
npm install

# Configure .env
 echo -e "TOKEN='INSERT_DISCORD_TOKEN_HERE'\nMONGOPASS='INSERT_MONGO_SRV_URI_HERE'" > .env
```

### Configuration

After cloning the project and installing the dependencies, you need to add your [Discord token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) and [MongoDB SRV URI](https://www.mongodb.com/docs/manual/reference/connection-string/) for your cluster in the `.env` file. You may also configure the `data/elevatedUsers.json` file to include the user IDs of each desired member.

### Running the Bot

This bot can be ran a number of ways. To run the bot locally, simply use:

```bash
node .
```

It is recommended to run the bot using [Docker](https://www.docker.com/), [Oracle Cloud](https://www.oracle.com/cloud/), etc.

## Features

Below is a list of major features of the bot.

### General Features

- Every 50th message, a random Dogie will spawn and give you a random amount of money.
- Use this money to give to other users, gamble, or convert into expreience (XP).
- Converting into XP allows user to level up, which not only reduces the amount of required messages to get money but also gives a leaderboard position.
- If an orca is mentioned, an image of one will appear (highly requested feature).

### General (Unpriviledged) Commands:

- [Balance](#balance)
- [Message Count](#message-count)
- [Level](#level)
- [Funds](#funds)
- [Convert](#convert)
- [Gamble](#gamble)
- [Pay](#pay)
- [Say](#say)
- [Leaderboard](#leaderboard)
- [Help](#help)

### Admin (Priviledged) Commands:

- [Add Money](#add-money)
- [Remove Money](#remove-money)
- [Set Money](#set-money)
- [Scrape Emotes](#scrape-emotes)

### Balance

Displays user's balance.

`dogie balance`

### Message Count

Displays user's Message Count (out of total required according to level).

`dogie messagecount`

### Level

Displays user's level and XP needed to level up.

`dogie level`

### Funds

Gives user a random amount of money between 2500 and 10000 provided the user has a low enough balance.

`dogie funds`

### Convert

Converts an amount of money (or all of it) to XP.

`dogie convert 25000`
`dogie convert all`

### Gamble

User gambles an amount of money not exceeding 50,000 _or_ all of it. Low chance of a jackpot, even lower chance of a mega jackpot.

`dogie gamble 2048`
`dogie invest all`

### Pay

User pays an amount of money to another mentioned number.

`dogie pay @Saugy 2711`
`dogie pay 60000 @Theurgist`

### Say

Makes the bot say something for you.

`dogie say Hello World!`

### Leaderboard

Displays the levels leaderboard (accepted arguments: -c, -m, -coins, -money, in order to sort by money instead).

`dogie leaderboard`
`dogie lb -c`

### Help

Displays a help menu with every command, or info about a specific command.

`dogie help`
`dogie help convert`

Note: Using this command as an elevated user displays elevated commands.

### Add Money

Adds money to a mentioned user's account.

`dogie add 200 @Avoidingg`
`dogie add 4000`

### Remove Money

Removes money from a mentioned user's account.

`dogie remove @Pigeon 3000`
`dogie remove 2100`

### Set Money

Sets a user's balance to specified amount.

`dogie set @Brandon 100000`
`dogie set 60000`

### Scrape Emotes

Scrapes all emotes from a guild into database for use with the economy system (WIP).

By default, every emote is considered useable but boolean value can be updated to exclude them from the list (WIP).

`dogie scrapeemotes`

## TODO

- [x] fix the dictionary
- [x] improve README
- [ ] make filter cumulative and fine you for violating the filter
- [ ] sort dogies on database
- [ ] dogie rarities
- [ ] implement dynamically updating dogies using database
- [ ] rebalance economy (taxes and stocks and banks) (this will never get done)

## Contributing

Contributions are welcome, and you can do so by submitting a Pull Request to the repository.

## License

This project is licensed under the GNU General Public License v3.0. View the [LICENSE](LICENSE) file for more details.
