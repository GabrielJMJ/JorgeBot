var config = require('configurations');

module.exports = {
    // Send a kiss for someone
    kiss: function (client, channel, from, content) {
        // The destination
        var to = content.split(' ')[0];

        // If is not null or is not for himself
        if (from != to && to !== null) {
            client.say('#' + channel, from + ' kissed wonderfully ' + to + ' <3');
        }
    },
    // Send a name calling for someone
    slap: function (client, channel, from, content) {
        // The destination
        var to = content.split(' ')[0];

        // Some name callings
        var callings = config.slap_command_callings;

        // If is not null or is not for himself
        if (from != to && to !== null) {
            client.say(
                '#' + channel,
                callings[
                    Math.floor(Math.random() * callings.length)
                ].replace('{from}', from).replace('{to}', to)
            );
        }
    }
};