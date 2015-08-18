Array.prototype.hasValue = function (value) {
    for (var k = 0; k < this.length; k++) {
        if (this[k] == value) {
            return true;
        }
    }

    return false;
}

var irc      = require('irc')
  , configs  = require('./configurations.json')
  , settings = {
        channels : ['#' + configs.owner]
      , server : 'irc.twitch.tv'
      , port: 6667
      , secure: false
      , nick: configs.bot.user
      , password: configs.bot.password
    }
  , bot = new irc.Client(settings.server, settings.nick, {
        channels: [settings.channels + ' ' + settings.password]
      , debug: false
      , password: settings.password
      , username: settings.nick
    });

// Define the default commands for the bot
var defaultCommands = require('commands');

// Received messages
var messages = [];

// All received timeouts
var timeouts = [];

// Connect to Twitch IRC
bot.connect(function () {
    console.log('Connected!\n\n[CHAT FOR ' + configs.owner + ']\n\n');

    // Define messages to be sent on time intervals (defined in configurations.json)
    if (configs.messages_interval) {
        var messagesForInterval = configs.messages_interval;

        for (var k in messagesForInterval) {
            setInterval(function () {
                // Message body
                var msg =  messagesForInterval[k].message;
                bot.say('#' + configs.owner, msg);
                console.log(configs.bot.user.toLowerCase() + ': ' + msg + '\n');
            }, messagesForInterval[k].interval);
        }
    }
});

// Error handler
bot.addListener('error', function (err) {
    for (var k in err) {
        console.log(k, err[k]);
    }
});

// Receive messages and filter them all
bot.addListener('message', function (from, to, message) {
    if (!configs.ignore.hasValue(from)) {
        // IRC has a bug that duplies messages
        // This will check if the message is duplicated
        // If someone send the same message twice, the second one will not be captured
        if (!messages.length && from != messages[messages.length - 1].from && message !== messages[messages.length - 1].message) {
            console.log(from + ': ' + message + '\n');
            messages.push({from: from, message: message});

            // Filter the message
            filterBlockedWords(bot, configs.owner, configs.block_words, from, message);
            filterCommands(bot, configs.owner, configs.custom_commands, defaultCommands, from, message);
        }
    }
});

// Check if the message is a chat command
function filterCommands(bot, channel, customCommands, defaultCommands, from, message) {
    var messageParts = message.split(' ');

    // If the first word of the message has the command prefx
    if (messageParts[0].substr(0, 1) == configs.command_prefix) {
        // Check if it's a default command of the bot
        if (defaultCommands[messageParts[0].substr(1)]) {
            var content = [];

            for (var k in messageParts) {
                content.push(messageParts[k]);
            }

            content.splice(0, 1);
            // Define as command content everything that cames after the command
            defaultCommands[messageParts[0].substr(1)](
                bot, channel, from, content.join(' ')
            );
            // If is not a default command, check if a custom command defined by the user
        } else if (customCommands) {
            if (customCommands[messageParts[0].substr(1)]) {
                bot.say(
                    '#' + channel
                  , customCommands[messageParts[0].substr(1)].replace('{user}', from)
                );
            }
        }
    }
}

// Filter block words defined in configurations.json
function filterBlockedWords(bot, channel, blockedWords, from, message) {
    var messageParts = message.split(' ');

    for (var k in messageParts) {
        for (var i in blockedWords) {
            // If the message has, this will be removed giving a 1 second time out
            if (messageParts[k] === blockedWords[i]) {
                if (!timeouts[from]) {
                    timeouts[from] = {amount: 0};
                }
                
                if (timeouts[from].amount == configs.timeout.user_aceepted_failures) {
                    bot.say('#' + channel, '/timeout ' + from + ' ' + configs.timeout.last_to_time_in_seconds);
                } else {
                    bot.say('#' + channel, '/timeout ' + from + ' 1');
                    timeouts[from].amount++;
                }

                bot.say('#' + channel, from + ' you used an word that is banned on this chat.');
            }
        }
    }
}