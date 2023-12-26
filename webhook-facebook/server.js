const express = require('express')
const bodyParser = require('body-parser')
const app = express()

var fs = require('fs');


const VERIFY_TOKEN = "Test156f4sd9f87aserw4"
// EAAKsPj0LcLABO6kcgKbBePjIMZAwJDCxNFNObjw8A9dy54twVqid8y0fzizetuXsZA5i46vAV59UA16kohZCZC2DjZC1WRAZCBpwOGIHZA9LU1syYvXdRjy7WZBKtTiwcZC7ITLMkPl069WBhsNDmqohwCFOQOglvOyt8c6RiEDmy1bZAzn8aYZCCcRsJ4BnxVNcRS9dR3XQkQcYwQU
app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const { get } = require('lodash')
const request = require('request')

const PAGE_ACCESS_TOKEN = "EAAKsPj0LcLABO6kcgKbBePjIMZAwJDCxNFNObjw8A9dy54twVqid8y0fzizetuXsZA5i46vAV59UA16kohZCZC2DjZC1WRAZCBpwOGIHZA9LU1syYvXdRjy7WZBKtTiwcZC7ITLMkPl069WBhsNDmqohwCFOQOglvOyt8c6RiEDmy1bZAzn8aYZCCcRsJ4BnxVNcRS9dR3XQkQcYwQU"
// const PAGE_ACCESS_TOKEN = "EAAKsPj0LcLABO2HRT9PohQmJra7OBxjhTdbFogFPxaMZCmawzJ7zgAwcFr5rGgq6ZBasbmShBEiD2mzYshaR2jIuNNJBUiPOqMBSTZBVj7tCCiA1hfqI3HtQY2s4ZBrt2ZAOQQeTssYK5tKeN0fXDysOGAy06ZBZCuOMuBGE25EaMU7oGjSyFtxAjgXoCLodFl8D7iB2ODzWYA944fz";
const handleEvents = (events) => {
  const text = get(events, ['messaging', 0, 'message','text']);
  const sender = get(events, ['messaging', 0,'sender', 'id']);
  const requestBody = {
    "messaging_type" : "RESPONSE",
    "recipient": {
      id: sender
    },
    "message": { text }
  }

  const config = {
    method: 'post',
    uri: "https://graph.facebook.com/v18.0/me/messages",
    json: requestBody,
    qs: {
       access_token: `${PAGE_ACCESS_TOKEN}`,
    },
  };
  return request(config, (err, res, body) => {
    if (!body.error) {
      console.log('message sent!',body)
      return body
    } else {
      return new Error("Unable to send message:" + body.error);
    }
  }); 
}

// ROUTES
app.get('/', function(req, res) {
  res.send("Hello ^____^")
})
app.get('/js/library', function(req, res) {
  var file = fs.readFileSync(__dirname + '/js/library.js', 'binary');

  res.setHeader('Content-Length', file.length);
  res.write(file, 'binary');
  res.end();
})

// Facebook GET
app.get("/webhook", async (req, res) => {
  // Parse the query params
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  console.log('get', token , VERIFY_TOKEN);
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.send(challenge)
  }
  else {
    // Responds with '403 Forbidden' if verify tokens do not match
    console.log('WEBHOOK_VERIFIED');
    res.sendStatus(403);
  }
})

// Facebook POST
app.post('/webhook', async (req, res) => {
  const { body } = req;
  console.log('post');
  if (body.object === 'page') {
    const events = body && body.entry && body.entry[0]
    // console.log('POST events',events);
    // console.log('POST messaging',events.messaging);
    // console.log('POST standby',events.standby);
    if(events.messaging != undefined){
        // console.log('POST referral',events.messaging[0].referral.ref);
        // if(events?.messaging?[0]?.referral?.ref){
        if (events && events.messaging && events.messaging[0] && events.messaging[0].referral && events.messaging[0].referral.ref) {
            // console.log('POST ref',events.messaging[0].referral.ref);
            await creating_label(events,events.messaging[0].referral.ref)
            // console.log(events.messaging[0].referral.ref,await label_id)
            // await add_label(events,label_id)
        }
      
    }
    await handleEvents(events.messaging)
  }else{
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
  return res.sendStatus(200)
})


// app.post('/api', async (req, res) => {
//     const { body } = req;
//     console.log('body',body)
//     if (body.object === 'creatinglabel') {
//       if(body.LABEL_NAME){
//         await creating_label(body)        
//       }else{
//         res.sendStatus(404);
//       }

//     }else{
//       // Returns a '404 Not Found' if event is not from a page subscription
//       res.sendStatus(404);
//     }
//     return res.sendStatus(200)
//   })

const creating_label = (events,label_name) => {
    // const text = get(events, ['messaging', 0, 'message','text']);
    // const LABEL_NAME = get(body, ['LABEL_NAME']);
    // console.log('LABEL_NAME',LABEL_NAME)

    const requestBody = {    
        "page_label_name": label_name,  
      }
  
    const config = {
      method: 'post',
      uri: "https://graph.facebook.com/v18.0/me/custom_labels",
      json: requestBody,
      qs: {
         access_token: `${PAGE_ACCESS_TOKEN}`,
      },
    };

    request(config, (err, res, body) => {
      if (!body.error) {
        console.log('creating_label sent!',body.id)
        add_label(events,body.id)

        return body
      } else {
        return new Error("Unable to send message:" + body.error);
      }
    }); 
}


const add_label = (events,label_id) => {
    // const text = get(events, ['messaging', 0, 'message','text']);
    const USER_PSID = get(events, ['messaging', 0,'sender', 'id']);
    const PAGE_ID = get(events, ['messaging', 0,'recipient', 'id']);
    // const page_label_name = get(events, ['messaging', 0,'referral', 'ref']);
    // const label_id =  label_id
    console.log('creating_label',label_id)
    const requestBody = {    
        "user": USER_PSID
      }
  
    const config = {
      method: 'post',
      uri: "https://graph.facebook.com/v18.0/"+label_id+"/label",
      json: requestBody,
      qs: {
         access_token: `${PAGE_ACCESS_TOKEN}`,
      },
    };
    console.log(config)
    return request(config, (err, res, body) => {
      if (!body.error) {
        console.log('message sent!',body)
        return body
      } else {
        return new Error("Unable to send message:" + body.error);
      }
    }); 
}
app.listen(app.get('port'), function() {
  console.log("🚀 Server ready ~~~~")
})