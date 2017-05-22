var Twit = require('twit');

var T = new Twit({
  consumer_key:         '7Y1LiEiNImDJiFVbSi4h5xMbz',
  consumer_secret:      'W8EoRU0PnrxT8ginyrRdOV96Lu3dWX7C9mToNcnZ30PeyoCcdF',
  access_token:         '863684063164542977-39j3acYPbP5IYQk0joDsmaWiy7DtdJK',
  access_token_secret:  'PkcZhNT2RGXzWelLggO3tXXRjzDUJ7YJ7CeQbifltWwUh',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

var stream = T.stream('statuses/filter', { track: 'epiccbot' });

var usrStream = T.stream('user', { stringify_friend_ids: true });

stream.on('tweet', postTweet);

usrStream.on('follow', followBack);

//usrStream.on('direct_message', dmBack);

function postTweet(tweet) {

  var reply_to = tweet.in_reply_to_screen_name;

  var name = tweet.user.screen_name;

  var id = tweet.id_str; 

  var user_id = tweet.user.id_str;  

  var replyText = 'epic';
  
  if (tweet.text.includes('@epiccbot') || reply_to === 'epiccbot'){
  
    T.post('statuses/update', { status: replyText, in_reply_to_status_id: id, auto_populate_reply_metadata: true }, tweeted);

  }
  
  function tweeted(err, reply) {
    if (err) {
      console.log(err.message);
    } else {
      console.log('Tweeted: ' + reply.text);
    }
  }
}

function followBack(follow) {

  var name = follow.source.screen_name;
  
  T.post('friendships/create', { screen_name: name, follow:true }, followed);
  
  function followed(err, newfollow) {
	if (err) {
	  console.log(err.message);
    } else {
      console.log('Followed: ' + name);
    }
  }	
  
}

function dmBack(direct_message) {

  var sender_id = direct_message.direct_message.sender.id_str;
  
  T.post('direct_messages/events/new', { event: { type: 'message_create',
									     message_create: {
										   target: {recipient_id: sender_id},
										   message_data: {text: 'epic'}
									   } } }, sent);
  
  function sent(err, reply) {
	if (err) {
	  console.log(err.message);
    } else {
      console.log('DMed: ' );
    }
  }	 
}

