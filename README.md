# Odin

[![GitHub license](https://img.shields.io/github/license/jenkinsci/plugin-pom)](/LICENSE)

A Funny Telegram Bot.

## Setup

- Clone the repository.
- Run `npm install`.
- Make a new file named as `.env` and write into it the telegram bot token you receive from the [BotFather](https://t.me/BotFather) as `TELEGRAM_API_TOKEN = XXXXXXXXXXXXXXXXX`.
- Run `node index.js`.

## Commands

- `/start` or `/heyodin` - Lists all the bot commands available
- `/meetups` - List all the meetups of open source communities in Delhi NCR.
- `/xkcd` - Sends a random xkcd strip.
- `/chuck` - Sends a Chuck Norris joke.
- `/chuck <first-name>` - Sends a Chuck Norris joke with the firstname as the main character.
- `/quote` - Sends an inspirational quote.
- `/save <note-name> <note-content>` - Saves note to the database.
- `/saved` - Sends the list of saved notes from the database.
- `/delete <note-name>` - Deletes note from the database.
