# Odin

[![GitHub license](https://img.shields.io/github/license/jenkinsci/plugin-pom)](/LICENSE)

A Funny Telegram Bot.

## Setup

- Clone the repository.
- Run `yarn`.
- Make a new file named as `.env` and write into it the telegram bot token you received from the [BotFather](https://t.me/BotFather) as `TELEGRAM_API_TOKEN = XXXXXXXXXXXXXXXXX`.
- Run `node index.js`.

## Commands

- `/start` or `/heyodin` - Lists all the bot commands available
- `/meetups` - Lists all the meetups of open source communities in Delhi NCR.
- `/xkcd` - Sends a random xkcd strip.
- `/chuck` - Sends a Chuck Norris joke.
- `/chuck <first-name>` - Sends a Chuck Norris joke with the firstname as the main character.
- `/commitstrip` - Sends a random commitstrip comic
- `/quote` - Sends an inspirational quote.
- `/save <note-name> <note-content>` - Saves note to the database.
- `/saved` - Sends the list of saved notes from the database.
- `/delete <note-name>` - Deletes note from the database.
