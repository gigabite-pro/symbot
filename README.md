# symbot
A bot which accepts an audio file attachment on discord, transcribes it using the symbl.ai API, and then returns the transcribed text as a new message. It also allows the user to copy the text to the clipboard for future use or can download the text as a .txt file on the system.

### Video
[![Watch the video](https://img.youtube.com/vi/WrX-YvMX1kE/hqdefault.jpg)](https://youtu.be/WrX-YvMX1kE)

## Getting started
1. Clone the source code and install all the dependencies.
```bash
$ git clone https://github.com/gigabite-pro/symbot
$ cd symbot && npm install
```
2. Enter your Discord and Symbl API tokens in a `.env`.
3. Run the bot using `npm run dev`.
