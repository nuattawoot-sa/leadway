$(document).ready(function () {

    $(".social_click").on('click', function(event){
       //do something fired 5 times
       var social_name = $(this).attr('data-social_name');
       var campaign_id = $(this).attr('data-campaign_id');

       if(social_name == 'facebook-messenger'){
          var fbUsername = 'DevCheeseTH';
          // var message = "สวัสดีฉันมาจากเว็บไซต์ Leadway :";
          // window.open("https://m.me/rn/"+fbUsername+"?messaging_source=source%3Apages%3Amessage_shortlink&recurring_notification=1&topic=Updates and promotions&ref=summer_coupon&text="+message+"", "myWindow", "width=700,height=700"); 
          window.open(`https://m.me/rn/${fbUsername}?ref=website`, "myWindow", "width=700,height=700"); 
       }else{
          social_name = social_name.split(":")[0]
          social_data = social_name.split(":")[1]
          if(social_name== 'tel' || social_name == 'sms'){
             window.open(social_name+':'+social_data, '_parent'); 
          }
       }

       $.get('https://ipinfo.io/json?token=1b0396e7fc0b9b', function(response) {
          $.ajax({
             type: "post",
             url: "http://localhost:1337/api/social-clicks/",
             data: JSON.stringify({
                "data": {
                   "social_name": social_name,
                   "ip_location": response.ip,
                   "data_location": response,
                   "campaign_id": campaign_id
                }
             }),
             headers: {
                "Authorization": "Bearer 3ed71ffd12614cdbef7eaeb1b9bc76216dd38b67362424d634270b1d90c4b3c9c031d508c0732e7fbe3b4118f5bacaaca4159fce20bd95e0e369322870dd2164e5406477e05a46da1567118091234e83f71d8f157f571e79859a78686a517ff0657072ad517581c5a6687208e4f98e4d4db2a4c85b246b1709a0700bbbdbfb11",
                "Content-Type": "application/json"
             },
             dataType: "json",
             beforeSend: function(){
             },
             complete: function(){
             },
             success: function(res) {
                console.log(res);
             }
          });
 
          console.log(response.ip);
       }, "jsonp");
    });
});