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
gaminghub.gg|"rsa-2048"|shop.gaminghub.gg,forums.gaminghub.gg|Let's Encrypt|2025-01-05T16:50:25Z|2025-03-05T16:50:25Z`;

export default sampleData;
