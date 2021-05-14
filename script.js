let p = require("puppeteer");
let fs = require("fs");
let url = "https://www.instagram.com/accounts/login/";
let id = "rikave2014@firmjam.com";
let pw = "Sam@great";
let tab;
let totalFollowers;
let scrolls;
(async function(){
let browser = await p.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    slowMo:5,
});
let tabs = await browser.pages();
tab = tabs[0];

await tab.goto(url);
await tab.waitForSelector('input[name = "username"]', {visible:true});
await tab.type('input[name = "username"]', id);
await tab.type('input[name = "password"]', pw);
await Promise.all([
    tab.waitForNavigation({ waitUntil: "networkidle2" }),
    tab.click(".sqdOP.L3NKy.y3zKF"), //login
  ]);
await tab.waitForSelector("._6q-tv");
await tab.click("._6q-tv");
await tab.waitForSelector("._7UhW9.xLCgt.MMzan.KV-D4.fDxYl");
let x = await tab.$$("._7UhW9.xLCgt.MMzan.KV-D4.fDxYl")
await Promise.all([
    tab.waitForNavigation({ waitUntil: "networkidle2" }),
    x[0].click(), //profile opens
  ]);

  //followers click -> list


await tab.waitForSelector(".-nal3");
  let y = await tab.$$(".-nal3");

  await tab.waitForSelector('span.g47SY');
  totalFollowers = await tab.evaluate(function()
    {
        return document.querySelectorAll(".g47SY")[1].innerText;
    });

    console.log(totalFollowers);
    scrolls = Math.ceil(totalFollowers / 12);

  await Promise.all([
    tab.waitForNavigation({ waitUntil: "networkidle2" }),
    y[1].click(), //followers open
  ]);


  let followers = await tab.evaluate(async function (total) {

let followersnames = await new Promise(function(resolve,reject){
    let interval = setInterval(function()
    {
        let follower = document.querySelectorAll(".FPmhX.notranslate._0imsa"); //12,24
        console.log(follower.length);
        follower[follower.length-1].scrollIntoView();


        if(follower.length == total){ //scroll complete
        clearInterval(interval);
         let names = {};
        for(let i = 0; i<follower.length; i++){
          //console.log(follower[i].innerText);
          names[follower[i].innerText] = 1;
        }
        
        //console.log(names);
        resolve(names);
        }
    }, 1000); 
});
return followersnames;
},totalFollowers);
console.log(followers); 

await tab.waitForSelector("._8-yf5");
let z = await tab.$$("._8-yf5");
z[1].click(); //close


await tab.waitForSelector('span.g47SY');
totalFollowing = await tab.evaluate(function()
  {
      return document.querySelectorAll(".g47SY")[2].innerText;
  });

  console.log(totalFollowing);
  await tab.waitForSelector(".-nal3");
  y = await tab.$$(".-nal3");
await Promise.all([
  tab.waitForNavigation({ waitUntil: "networkidle2" }),
  y[2].click(), //following open
]);


let following = await tab.evaluate(async function (total) {

let followingnames = await new Promise(function(resolve,reject){
  let interval = setInterval(function()
  {
      let following = document.querySelectorAll(".FPmhX.notranslate._0imsa"); //12,24
      console.log(following.length);
      following[following.length-1].scrollIntoView();


      if(following.length == total){ //scroll complete
      clearInterval(interval);
       let names2 = {};
      for(let i = 0; i<following.length; i++){
        //console.log(follower[i].innerText);
        names2[following[i].innerText] = 1;
      }
      
      //console.log(names);
      resolve(names2);
      }
  }, 1000); 
});
return followingnames;
},totalFollowing);
console.log(following); 

for(let key in following){
  if(!followers.hasOwnProperty(key)){ //if not follower
    //console.log(key);
    //fs.appendFileSync("index.html", "<br>");
    fs.appendFileSync("index.html", "<li class='item'>");
    fs.appendFileSync("index.html",key);
    fs.appendFileSync("index.html", "</li>");
  }
}

})();
