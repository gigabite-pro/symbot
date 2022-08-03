const axios = require('axios');

function convertAudioToText(accessToken, url) {
    let promise = new Promise((resolve, reject) => {
        const data = JSON.stringify({
            "url": url,
            "name": "Audio File",
            "confidenceThreshold": 0.6
        });
          
        const config = {
            method: 'post',
            url: 'https://api.symbl.ai/v1/process/audio/url',
            headers: { 
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            data : data
        };
          
        axios(config)
          .then(function (response) {
            resolve(response.data.conversationId);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });          
    })
    return promise;
}

module.exports = convertAudioToText;