require("./db/conn")
const { log } = require("console");
const { Socket } = require("dgram");
const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT
const {createServer} = require("http");

const chatmodel = require("./db/chatschema");


const words = ["loda","chut","mkc","gand","tapa-tap","sex","sex-sux","bhosda","aad","aand","bahenchod","behenchod","bhenchod","bhenchodd","b.c.","bc","bakchod","bevda","bewda","bevdey","bewday","bevakoof","bevkoof","bevkuf","bewakoof","bewkoof","bewkuf","bhadua","bhaduaa","bhadva","bhadvaa","bhadwa","bhadwaa","bhosada","bhosda","bhosdaa","bhosdike","bhonsdike","bsdk","b.s.d.k","bhosdiki","bhosdiwala","bhosdiwale","bhosadchodal","bhosadchod","babbe","babbey","bube","bubey","bur","burr","buurr","buur","charsi","chooche","choochi","chuchi","chhod","chod","chodd","chudne","chudney","chudwa","chudwaa","chudwane","chudwaane","choot","chut","chute","chutia","chutiya","chutiye","chuttad","chutad","dalaal","dalal","dalle","dalley","fattu","gadha","gadhe","gadhalund","gaand","gand","gandu","gandfat","gandfut","gandiya","gandiye","goo","gu","gote","gotey","gotte","hag","haggu","hagne","hagney","harami","haramjada","haraamjaada","haramzyada","haraamzyaada","haraamjaade","haraamzaade","haraamkhor","haramkhor","jhat","jhaat","jhaatu","jhatu","kutta","kutte","kuttey","kutia","kutiya","kuttiya","kutti","landi","landy","laude","laudey","laura","lora","lauda","ling","loda","lode","lund","launda","lounde","laundey","laundi","loundi","laundiya","loundiya","lulli","maar","maro","marunga","madarchod","madarchodd","madarchood","madarchoot","madarchut","m.c.","mc","mamme","mammey","moot","mut","mootne","mutne","mooth","muth","nunni","nunnu","paaji","paji","pesaab","pesab","peshaab","peshab","pilla","pillay","pille","pilley","pisaab","pisab","pkmkb","porkistan","raand","rand","randi","randy","suar","tatte","tatti","tatty"
]


const blockedIps = new Set();
app.set('trust proxy', true);

const { Server } = require("socket.io");
const server = createServer(app);

const io = new Server(server);

app.use(express.static("./public"));


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})
app.get("/aboutus",(req,res)=>{
    res.sendFile(__dirname+"/aboutus.html")
})



async function insertintodb(msg){
    let doc = await chatmodel.findOne() || new chatmodel();
    doc.items.push(msg);
    await doc.save();
    
}
app.use((req, res, next) => {
    req.realIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
  });

const blockIp = (ip) => {
    blockedIps.add(ip);
    console.log(`IP ${ip} has been manually blocked`);
  };
  

io.use((socket, next) => {
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    const realIp = ip.split(',')[0].trim();
  
    if (blockedIps.has(realIp)) {
      socket.emit('redirect', '/blocked');
      return next(new Error('IP blocked'));
    }
    socket.ip = realIp;
    next();
  });

io.on("connection",async(socket)=>{
    console.log("a user connceted");
    
    
    socket.on("disconnect",()=>{
        console.log('user disconnected');
    });
   

    socket.on("message",async(msg)=>{
     socket.broadcast.emit("message",msg);
     insertintodb(msg)
     console.log(socket.ip);
     lowermsg=msg.message.toLowerCase()
     if(words.some(word => lowermsg.includes(word))){
     console.log(`abusive word from ${socket.ip}:${msg.message}`);
     let blockmsg={
        user:"Admin",
        message:`abusive word from ${msg.user}: ${msg.message} [[Hence blocked]]`
    }
    socket.broadcast.emit("message",blockmsg);
    blockIp(socket.ip);
    socket.emit('redirect', '/blocked');
     
     socket.disconnect(true);
     console.log(`blocked`);
     
    }
    })

    
});


server.listen(PORT,()=>console.log("listning to port",PORT))