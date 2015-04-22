var request = require('request');
var nodemailer = require('nodemailer');
var config = {
  mail:{
    from:{
      name: '有货通知',
      host: 'smtp.163.com',
      auth: {
        user: 'lisi@163.com',   // email
        pass: 'woshilisi'    // pass
      }
    },
    to: [
      '张三 <zhangsan@163.com>'
    ]
  }
};
var smtpTransport = nodemailer.createTransport('SMTP', config.mail.from);
var area = {
  'R409': 'Causeway Bay',
  'R485': 'Festival Walk',
  'R428': 'ifc mall'
};
var phones = {
  "MGAF2ZP/A" : '6 Plus|金色|128GB',
  "MG492ZP/A" : '6|金色|16GB',
  "MGAC2ZP/A" : '6 Plus|灰色|128GB',
  "MGA92ZP/A" : '6 Plus|银色|16GB',
  "MG4F2ZP/A" : '6|灰色|64GB',
  "MG472ZP/A" : '6|灰色|16GB',
  "MG4A2ZP/A" : '6|灰色|128GB',
  "MGAK2ZP/A" : '6 Plus|金色|64GB',
  "MGAA2ZP/A" : '6 Plus|金色|16GB',
  "MG4J2ZP/A" : '6|金色|64GB',
  "MGAJ2ZP/A" : '6 Plus|银色|64GB',
  "MG4H2ZP/A" : '6|银色|64GB',
  "MGAE2ZP/A" : '6 Plus|银色|128GB',
  "MG4E2ZP/A" : '6|金色|128GB',
  "MG482ZP/A" : '6|银色|16GB',
  "MGAH2ZP/A" : '6 Plus|灰色|64GB',
  "MG4C2ZP/A" : '6|银色|128GB',
  "MGA82ZP/A" : '6 Plus|灰色|16GB'
};
var pres = {
  'Causeway Bay': {},
  'Festival Walk': {},
  'ifc mall': {}
};
var lasttime = false;
setInterval(function(){requestjson();}, 3000);

function requestjson(){
  request('https://reserve.cdn-apple.com/HK/zh_HK/reserve/iPhone/availability.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var res = JSON.parse(body);
      if(!res['R485']) return;
      if(res['updated'] == lasttime){
        lasttime = res['updated'];
        return;
      }
      lasttime = res['updated'];

      var change = false;
      var html = "<style>.tbl{border: 1px solid #666666; border-collapse: collapse;} .tbl td{border: 1px solid #666666; padding: 8px;}</style><table class='tbl'>";
      var content = "";
      for(s_i in res){
        for(p_i in res[s_i]){
          if(res[s_i][p_i] == true){
            if("有货" != pres[area[s_i]][phones[p_i]]){
              change = true;
            }
            pres[area[s_i]][phones[p_i]] = "有货";
            content+="<tr><td>"+area[s_i]+"</td><td>"+phones[p_i]+"</td><td>有货</td></tr>";
          } else {
            pres[area[s_i]][phones[p_i]] = "无货";
          }
        }
      }
      html += (content+"</table>");
      if(change){
        console.log("有货邮件通知\n");
        sendMail('6/6 plus有货啦', html);
      }
    }
  });
}

function sendMail(subject, html) {
  var mailOptions = {
    from: [config.mail.from.name, config.mail.from.auth.user].join(' '),
    to: config.mail.to.join(','),
    subject: subject,
    html: html
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + response.message);
    }
    smtpTransport.close();
  });
}
