const axios = require('axios');

const data = JSON.stringify({
  "type": "application",
  "appId": `${process.env.SYMBL_API_APPID}`,
  "appSecret": `${process.env.SYMBL_API_APPSECRET}`,
});

const config = {
  method: 'post',
  url: 'https://api.symbl.ai/oauth2/token:generate',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

function generateAccessToken() {
    let promise = new Promise((resolve, reject) => {
        axios(config)
        .then(function (response) {
            resolve(response.data.accessToken);
        })
        .catch(function (error) {
            console.log(error);
            reject(error);
        });
    })
    return promise;
}

module.exports = generateAccessToken;