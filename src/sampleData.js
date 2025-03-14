const sampleData = `Main_Domain|KeyLength|SAN_Domains|CA|Created|Renew
example.com|"ec-256"|www.example.com|LetsEncrypt.org|2025-02-25T10:00:18Z|2025-04-25T10:00:18Z
testsite.net|"rsa-2048"|www.testsite.net,api.testsite.net|DigiCert Inc.|2025-01-15T08:45:30Z|2025-03-15T08:45:30Z
securebank.org|"ec-384"|login.securebank.org,mobile.securebank.org|GlobalSign|2025-03-05T12:30:45Z|2025-05-05T12:30:45Z
mywebsite.io|"rsa-4096"|cdn.mywebsite.io,blog.mywebsite.io|Sectigo|2025-04-10T14:20:10Z|2025-06-10T14:20:10Z
cloudservice.com|"ec-256"|api.cloudservice.com,dashboard.cloudservice.com|Amazon Trust Services|2025-02-01T07:15:50Z|2025-04-01T07:15:50Z
bigcorp.co|"rsa-2048"|secure.bigcorp.co,sso.bigcorp.co|GoDaddy|2025-01-28T09:10:22Z|2025-03-28T09:10:22Z
devtools.dev|"ec-384"|staging.devtools.dev,beta.devtools.dev|ZeroSSL|2025-03-12T11:55:00Z|2025-05-12T11:55:00Z
fastvpn.net|"rsa-4096"|vpn.fastvpn.net,secure.fastvpn.net|Cloudflare Inc.|2025-02-18T13:40:35Z|2025-04-18T13:40:35Z
enterprise.biz|"ec-256"|admin.enterprise.biz,portal.enterprise.biz|Entrust|2025-03-22T15:05:12Z|2025-05-22T15:05:12Z
gaminghub.gg|"rsa-2048"|shop.gaminghub.gg,forums.gaminghub.gg|Let's Encrypt|2025-01-05T16:50:25Z|2025-03-05T16:50:25Z
ecommerce.com|"rsa-2048"|checkout.ecommerce.com,secure.ecommerce.com|DigiCert Inc.|2025-02-10T09:30:00Z|2025-04-10T09:30:00Z  
streaming.tv|"ec-256"|cdn.streaming.tv,live.streaming.tv|GlobalSign|2025-03-01T11:00:45Z|2025-05-01T11:00:45Z  
medsecure.health|"rsa-4096"|portal.medsecure.health,api.medsecure.health|Sectigo|2025-01-20T14:15:22Z|2025-03-20T14:15:22Z  
technews.blog|"ec-384"|news.technews.blog,archive.technews.blog|Let's Encrypt|2025-04-05T12:45:30Z|2025-06-05T12:45:30Z  
socialapp.io|"rsa-2048"|chat.socialapp.io,video.socialapp.io|Cloudflare Inc.|2025-02-25T08:20:15Z|2025-04-25T08:20:15Z  
analytics.ai|"ec-256"|dashboard.analytics.ai,api.analytics.ai|Amazon Trust Services|2025-03-18T10:50:40Z|2025-05-18T10:50:40Z  
fileshare.net|"rsa-4096"|upload.fileshare.net,download.fileshare.net|ZeroSSL|2025-01-10T07:35:50Z|2025-03-10T07:35:50Z  
education.edu|"ec-384"|courses.education.edu,library.education.edu|GoDaddy|2025-02-15T13:10:25Z|2025-04-15T13:10:25Z  
datacenter.cloud|"rsa-2048"|backup.datacenter.cloud,monitor.datacenter.cloud|Entrust|2025-03-28T16:30:55Z|2025-05-28T16:30:55Z  
newstoday.media|"ec-256"|breaking.newstoday.media,opinion.newstoday.media,longdomainblablablablalblabalblaalfablablablabbblalbalbalblalblablalbasdfsadfsadfasfsadfsadfsadfsadfasdfasdfasdflabllablalbalblasdfablablalb.de|Let's Encrypt|2025-01-08T15:40:12Z|2025-03-08T15:40:12Z
`;
export default sampleData;
