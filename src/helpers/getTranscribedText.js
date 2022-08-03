var axios = require('axios');

function getTranscribedText(accessToken, conversationId) {
    let promise = new Promise((resolve, reject) => {
        const config = {
            method: 'get',
            url: `https://api.symbl.ai/v1/conversations/${conversationId}/messages`,
            headers: { 
              'Authorization': `Bearer ${accessToken}`,
            }
        };
        
        setTimeout(() => {
          axios(config)
          .then(function (response) {
            let transcribedText = ""
            response.data.messages.forEach(message => {
                transcribedText += message.text + " "
            })
            resolve(transcribedText);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
        }, 10000);
    })
    return promise;
}

module.exports = getTranscribedText;