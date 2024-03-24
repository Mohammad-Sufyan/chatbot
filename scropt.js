const sendChatbtn = document.querySelector(".chat-input span");
const ChatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatToggler= document.querySelector(".chatbot-toggler");
const chatbotclosebtn= document.querySelector(".close-btn");

let UserMessage;
const API_KEY = "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";
const inputInitHeight = ChatInput.scrollHeight;

const createChatLi=(message, classname) =>{
    const chatLi = document.createElement("Li");
    chatLi.classList.add("chat", classname);
    let chatcontent=classname ==="outgoing" ? `<p>}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p> </p>`;
    chatLi.innerHTML= chatcontent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

const generateResponse =(incomingChatLi)=>{
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messageElement =incomingChatLi.querySelector("p");

    const requestOptions ={
        method:"POST",
        headers:{
            "Content-Type": "application/json",
              "Authorization":`Bearer ${API_KEY} `
             },
             body:JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content:UserMessage}]
             })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent="Oops somethings went wrong. Please try again! ";
    }).finally(()=>chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handlechat =()=>{
    UserMessage=ChatInput.value.trim();
    console.log(UserMessage);
    if(!UserMessage) return;
    ChatInput.value="";
    ChatInput.style.height =`${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(UserMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking......", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
    
}

ChatInput.addEventListener("input", ()=>{
    ChatInput.style.height =`${inputInitHeight}px`;
    ChatInput.style.height =`${ChatInput.scrollHeight}px`;
});
ChatInput.addEventListener("keydown", (e)=>{
    if(e.key==="Enter" && !e.shiftkey && window.innerWidth > 800) {
        e.preventDefault();
        handlechat();
    }
});

sendChatbtn.addEventListener("click", handlechat);
chatToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"));
chatbotclosebtn.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"));