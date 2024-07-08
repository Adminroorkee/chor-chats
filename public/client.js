const socket = io();
let name;
let textarea = document.querySelector(".message-input form textarea");
let chatContainer = document.querySelector(".chat-container");
let sendbtn = document.querySelector(".message-input form button");
do {
   let text = prompt("Enter your name:");
   name = text[0].toUpperCase()+text.slice(1)
} while (!name);

textarea.addEventListener("keyup",(e)=>{
   if(e.key==="Enter"){
    if (e.target.value.trim()!==""){
    sendMessage(e.target.value);
    }}
});

sendbtn.addEventListener("click",(e)=>{
   e.preventDefault();
   if (textarea.value!==""){
   sendMessage(textarea.value);
   }
 });

 
function sendMessage(message){
   textarea.value="";
    
    let msg={
        user:name,
        message:message.trim()
    }

    appendMessage(msg,'right-chat');

    socket.emit("message",msg)
}

function appendMessage(msg,type){
    let mainDiv = document.createElement("div");
    let className = type
    mainDiv.classList.add(className,"chat-box");
    
    let markup = ` ${msg.user} <br>
    <div class="message">${msg.message}</div> `

    mainDiv.innerHTML = markup
    chatContainer.appendChild(mainDiv);
    scrollbottom();

}

// receive msgg 
function playmusic(){
let beat = new Audio('/happy-pop-2-185287.mp3');
beat.play();

}

socket.on("message",(msg)=>{
    playmusic();
    appendMessage(msg,"left-chat");
})
socket.on('redirect', (url) => {
    console.log('Redirecting to:', url);
    window.location.href = url;
  });

  
console.log(blockedIps);


function scrollbottom(){
    chatContainer.scrollTop = chatContainer.scrollHeight;
}