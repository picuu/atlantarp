module.exports = async (client, interaction) => {

    const command = client.slashCommands.get(interaction.commandName)

    if (!command) return;

    // const Guild = interaction.member.guild

    // await guildModel.findOne({ guildId: interaction.guildId}).then((guildData, err) => {
    //     if (err) return console.log(err);
    //     if (guildData){
    //         Guild.accounts = guildData.accounts
    //     } else {
    //         const newGuildData = new guildModel({ guildId: interaction.guildId.toString(), accounts: none })
    //         newGuildData.save().catch(err => console.log(err))
    //     }
    // })

    try {
        await command.run(client, interaction)
    } catch (err) {
        console.error(err)
        return interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true })
    }

}

