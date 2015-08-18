JorgeBot
========
Twitch bot for your chat. <br>
**Status:** ```In-development```

## Usage
First, you have to install NodeJS here: http://nodejs.org.
### Configuration
* ```YOUR_CHANNEL``` is the channel where the bot will be activated.
* ```BOT_USER``` is the Twitch username of the bot.
* Go to http://twitchapps.com/tmi logged on Twitch with your bot account and generate a password. Copy ```oauth:...``` and replace ```OAUTH_PASS``` by that.

```json
{
    "owner": "YOUR_CHANNEL",
    "bot": {
        "user": "BOT_USER",
        "password": "OAUTH_PASS"
    },
    "ignore": [
        "moobot",
        "nightbot"
    ],
    "msg_interval_time": 20,
    "custom_commands": {
        //...
    },
    "default_commands": [
        "kiss",
        "slap"
    ],
    "block_words": [
        //...
    ],
    "messages_interval": [
    ],
    "command_prefix": "!",
    "slap_command_callings": [
        "{from} said {to} smells sand in the desert where his mother became a prostitute in exchange for olives.",
        "Hey {from}! I'm not with desire to offend {to}. Fuck yourself and be lovely with your friends.",
    ],
    "timeout": {
        "user_aceepted_failures": 3,
        "last_to_time_in_seconds": 600
    }
}
```
### Executing
Download the ZIP file: https://github.com/GabrielJMJ/JorgeBot/archive/master.zip
Or clone: ```$ git clone https://github.com/GabrielJMJ/JorgeBot```.
Go to the path that you extrated files in cmd and execute that command and run the bot. Futurely this will have an executable.
```cmd
$ npm install
$ npm start
```