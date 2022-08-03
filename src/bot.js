require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const fs = require('fs')
const cp = require('copy-paste')
const generateAccessToken = require("./helpers/generateAccessToken");
const convertAudioToText = require("./helpers/convertAudioToText");
const getTranscribedText = require("./helpers/getTranscribedText");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

let attachment = "";
let status = "";
let sentMessage = ""
let mainTranscribedText = ''

client.on("messageCreate", (message) => {
    if (message.attachments.size > 0 && message.attachments.size < 2) {
        const type = message.attachments.map((a) => a.contentType).join("");
        if (type.includes("audio")) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("yes")
                        .setLabel("Get into text")
                        .setStyle(ButtonStyle.Success)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("no")
                        .setLabel("No thanks")
                        .setStyle(ButtonStyle.Danger)
                );

            attachment = message.attachments.map((a) => a.url);

            message.reply({
                content: "Do you want to transcribe this audio file?",
                components: [row],
            })
            .then(resp => {
                sentMessage = resp.id
            })
            .catch(err => console.log(err));
        }
    }
});


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return false;

    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("copy")
            .setLabel("Copy Text")
            .setStyle(ButtonStyle.Primary)
    ).addComponents(
        new ButtonBuilder()
            .setCustomId("download")
            .setLabel("Download the file")
            .setStyle(ButtonStyle.Secondary)
    )

    if (interaction.customId === "yes") {
        interaction.deferReply();
        const accessToken = await generateAccessToken();
        const conversationId = await convertAudioToText(
            accessToken,
            attachment[0]
        );
        const transcribedText = await getTranscribedText(
            accessToken,
            conversationId
        );
        interaction.editReply({
            content: `
        Here is the transcribed text from the audio file uploaded:\n> ${transcribedText}`,
        components: [row]
        });
        status = true
        mainTranscribedText = transcribedText
    } else if(interaction.customId === "no") {
        interaction.reply({
            ephemeral: true,
            content: "Ok, no problem",
        });
        interaction.channel.messages.delete(sentMessage)
    } else if(interaction.customId === "download") {
        try{
            fs.writeFileSync('./src/transcribed.txt', mainTranscribedText)
        }catch(err){
            console.log(error)
        }
        interaction.reply({
            files: [{
                attachment : `${__dirname}/transcribed.txt`,
                name: 'transcribed.txt',
                description: 'Transcribed text from the audio file uploaded'
            }],
            ephemeral: true,
        })
        .then(() => {
            try {
                fs.unlinkSync('./src/transcribed.txt')
            } catch (error) {
                console.log(error)
            }
        })
        .catch(err => console.log(err))
    } else {
        cp.copy(mainTranscribedText, ()=>{
            interaction.reply({
                ephemeral: true,
                content: "Copied to clipboard",
            });
        })
    }
});

client.on('messageUpdate', (message)=>{
    if(status === true) {
        message.channel.messages.fetch(sentMessage)
        .then(msg =>{
            msg.delete().then(() => {
                status = ""
                sentMessage = ""
                attachment = ""
                channelId = ""
            })
        })
        .catch(err => console.log(err))
        
    }
})

client.login(process.env.DISCORD_TOKEN);
