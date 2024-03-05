// this is for web js
import * as info from "./personal_info.js";
import * as Api from "./api.js";

const contactInput = document.getElementById("search-bar");
const leftSide = document.querySelector("#leftSide");
const rightSide = document.querySelector(".right-side");
const oneMoreContactBtn = document.getElementById("more-contacts-btn");
const sendMessageBtn = document.getElementById("sendMessages");
const writeMessageInput = document.getElementById("forMessages");
const searchContactBtn = document.getElementById("magnifier");
const theChat = document.querySelector(".the-chat");
const fullWindow = document.querySelector(".full-window");
const refreshChatBtn = document.querySelector(".refreshChat");

// let currentPhoneNumber = "";

refreshChatBtn.addEventListener("click", () => {
  const phoneNumber = document.querySelector("#contactInformation");
  displayTheChat(phoneNumber.innerText);
  console.log("refreshed!");
});

// console.log(theChat);
theChat.addEventListener("contextmenu", async (event) => {
  event.preventDefault();
  const clicked = event.target;
  if (clicked.classList.contains("msj-text")) {
    if (!clicked.parentNode.children[1].innerText) {
      console.log("not send yet");
      return;
    }
    console.log(clicked);

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const popupHTML = `
      <div class="popup" style="position: absolute; left: ${mouseX}px; top: ${
      mouseY - 40
    }px;">
      <img src="../images/bin.png" alt="" id="img2" />
      <p>Delete<p>
    </div>
    `;

    const popup = document.createElement("div");
    popup.innerHTML = popupHTML;
    document.body.appendChild(popup);
    popup.addEventListener("click", async () => {
      popup.remove();
      const popup2HTML = `
      <div class="popup2">
        <div class="c1">
          <p>Delete message?</p>
          <p>You can delete messages for everyone or just for yourself.</p>
        </div>
        <div class="c2">
          <button id = "b1">Delete for everyone</button>
          <button id = "b2">Delete for me</button>
          <button id = "b3">Cancel</button>
        </div>
      </div>`;
      const popup2 = document.createElement("div");
      popup2.innerHTML = popup2HTML;
      fullWindow.classList.add("blur-me");
      document.body.appendChild(popup2);

      // console.log("wait");
      // const waitForSerialized = async (clicked) => {
      //   return new Promise((resolve) => {
      //     const fn = () => {
      //       let serializedMsj = clicked.parentNode.children[1].innerText;
      //       if (serializedMsj) resolve();
      //       else {
      //         setTimeout(() => {
      //           console.log("wait");
      //           fn();
      //         }, 500);
      //       }
      //     };
      //     fn();
      //   });
      // };

      // await waitForSerialized(clicked);
      let serializedMsj = clicked.parentNode.children[1].innerText;
      console.log(serializedMsj);

      let deleted = false;
      // console.log(serializedMsj);
      popup2.addEventListener("click", async (event) => {
        const clicked2 = event.target;
        console.log(clicked2);
        if (clicked2.id === "b1") {
          deleteMessage(serializedMsj, true), (deleted = true);
        }
        if (clicked2.id === "b2") {
          deleteMessage(serializedMsj, false), (deleted = true);
        }
        if (clicked2.id === "b3" || deleted) {
          popup2.remove();
          fullWindow.classList.remove("blur-me");
        }
        if (deleted) {
          clicked.remove();
          console.log("removed from your chat");
        }
      });
    });

    document.addEventListener("mousedown", function fn(event) {
      if (!popup.contains(event.target)) {
        popup.remove();
        document.removeEventListener("click", fn);
      }
    });

    theChat.addEventListener("scroll", function fn() {
      console.log("aaa");
      popup.remove();
      document.removeEventListener("scroll", fn);
    });

    leftSide.addEventListener("scroll", function fn() {
      console.log("aaa");
      popup.remove();
      document.removeEventListener("scroll", fn);
    });
  }
});

const correctTheTime = (hour, minute) => {
  let dateStr = "";
  minute = minute >= 10 ? minute : `0${minute}`;
  if (hour > 12) dateStr = `${hour - 12}:${minute} PM`;
  else dateStr = `${hour}:${minute} AM`;
  return dateStr;
};

const sendMessageVirtually = (message) => {
  console.log("send only visually");
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const dateStr = correctTheTime(hour, minute);
  let HTMLcode = `
  <div class="on-left">
    <p class="msj-text green-color">${message}
    <span class="time">${dateStr}</span>
    </p>
    <p class="hidden"></p>
    
  </div>
  `;
  const chatHTML = document.querySelector(".the-chat");
  chatHTML.innerHTML += HTMLcode;
  chatHTML.scrollTop = chatHTML.scrollHeight;
};

const changePhoneNumber = async (phoneNumber) => {
  try {
    isServerProcessing = true;
    console.log("we are changing the receiver number...");
    await fetch(`http://localhost:3000/?phoneNumber=${phoneNumber}`, {
      mode: "no-cors",
    });
    isServerProcessing = false;
    console.log("new receiver number", phoneNumber);
  } catch (error) {
    console.log(`There was a problem with the nodeJs server: ${error}`);
  }
};

const waitForServerProcessing = async () => {
  return new Promise((resolve) => {
    const fn = () => {
      if (!isServerProcessing) {
        resolve();
      } else {
        setTimeout(fn, 100);
      }
    };

    fn();
  });
};

let semaphore = Promise.resolve();
let isServerProcessing = false;
let currentPhoneNumber = "null";
let messagesQueue = [];

const pushMessageInQueue = (message, phoneNumber) => {
  console.log({ message, phoneNumber }, "pushed in queue");
  messagesQueue.push({ message, phoneNumber });
};

const completeHTMLmessage = (indexInHTML, serialized) => {
  const lastMessages = theChat.querySelectorAll(".msj-text");
  const currentMessage = lastMessages[lastMessages.length - indexInHTML];
  currentMessage.parentNode.children[1].innerText = serialized;
  // console.log();
};

//     msj1 msj2 msj3
//      3    2    1

const startRunningTheQueue = async () => {
  const sizeOfQueue = messagesQueue.length;
  while (messagesQueue.length > 0) {
    const { message, phoneNumber } = messagesQueue.shift();
    console.log(message, "from queue");
    await new Promise((resolve) => {
      setTimeout(async () => {
        const serialized = await Api.sendMessage(
          info.apiToken,
          info.id,
          phoneNumber,
          message
        );

        completeHTMLmessage(sizeOfQueue - messagesQueue.length, serialized);

        resolve();
      }, 3000);
    });
  }
};

const sendMessageWhatsapp = async (message, phoneNumber) => {
  pushMessageInQueue(message, phoneNumber);
  console.log(currentPhoneNumber);

  await semaphore;

  if (currentPhoneNumber !== phoneNumber) {
    //change phone number doar da call la nodeJs server, dar acolo mai dureaza web scraping-ul
    semaphore = changePhoneNumber(phoneNumber);
    currentPhoneNumber = phoneNumber;
    console.log("new number");
    // cu functia asta astept sa vad cand se termina script-ul din server!
    await waitForServerProcessing();
  }
  startRunningTheQueue();
};

const sendMessageOverall = async (message, phoneNumber) => {
  sendMessageVirtually(message);
  await sendMessageWhatsapp(message, phoneNumber);
};

const getAndCallsendMessage = async () => {
  const number = document.getElementById("contactInformation");
  const message = writeMessageInput.value;
  writeMessageInput.value = "";
  if (!number.innerText) {
    alert("Select a contact to chat with!");
    return;
  }
  await sendMessageOverall(message, number.innerText);
};

writeMessageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getAndCallsendMessage();
  }
});
sendMessageBtn.addEventListener("click", () => {
  getAndCallsendMessage();
});

let matchingContacts = [];
let indexForContacts = 0;

searchContactBtn.addEventListener("click", () => {
  indexForContacts = 0;
  leftSide.innerHTML = "";
  showContacts(contactInput.value);
});

contactInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    indexForContacts = 0;
    leftSide.innerHTML = "";
    showContacts(contactInput.value);
  }
});

oneMoreContactBtn.addEventListener("click", async () => {
  indexForContacts++;
  if (indexForContacts >= matchingContacts.length) {
    oneMoreContactBtn.classList.add("hidden");
    return;
  }
  await contactOnHTML();
  leftSide.scrollTop = leftSide.scrollHeight;
});

// let isServerProcessing = false;
// const changeTheReceiverNumber = async (phoneNumber) => {
//   // i have to call the auto browser tool
//   // autoBrowser.modifyNumber(phoneNumber, info.email, info.password, info.id);
//   // call the nodejs local server

//   if (currentPhoneNumber === phoneNumber) {
//     console.log("IS THE SAMEEEEEEEEEEEEEEEEEEEEEE or the server is processing");
//     return;
//   }

//   isServerProcessing = true;

//   currentPhoneNumber = phoneNumber;
//   try {
//     console.log("we are changing the receiver number...");
//     await fetch(`http://localhost:3000/?phoneNumber=${phoneNumber}`, {
//       mode: "no-cors",
//     });
//     console.log("done with the receiver number");
//   } catch (error) {
//     console.log(`There was a problem with the nodeJs server: ${error}`);
//   }

//   setTimeout(() => {
//     isServerProcessing = false;
//   }, 100);
// };

const displayTheChat = async (phoneNumber) => {
  // verify if you have already taken this chat before
  //  TO Do
  // console.log("the chat", phoneNumber);

  console.log("request-->", "display the chat");
  const chatMessages = await Api.getMessages(
    info.apiToken,
    info.id,
    phoneNumber,
    300
  );
  // console.log(chatMessages);
  // chatMessages.reverse();

  const transformDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    // console.log(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // console.log({ year, month, day, hours, minutes });
    return { year, month, day, hours, minutes };
  };

  const sorted = chatMessages.map((obj) => {
    const modified = {
      message: obj.message.body,
      image: obj.message.type,
      fromMe: obj.message.fromMe,
      _serialized: obj.message._data.id._serialized,
      date: transformDate(obj.message.timestamp),
    };
    return modified;
  });
  console.log(sorted);

  const chatHTML = document.querySelector(".the-chat");
  chatHTML.innerHTML = "";
  let currentDateMsj = {};

  sorted.forEach((element) => {
    if (
      element.date.year !== currentDateMsj.year ||
      element.date.month !== currentDateMsj.month ||
      element.date.day !== currentDateMsj.day
    ) {
      // console.log(element.date, currentDateMsj);
      currentDateMsj = element.date;
      const dateStr = `${currentDateMsj.month}/${currentDateMsj.day}/${currentDateMsj.year}`;
      const showDateHTML = `<div><div class="message-date">${dateStr}</div></div>`;
      chatHTML.innerHTML += showDateHTML;
    }
    const hour = element.date.hours;
    const minute = element.date.minutes;
    const dateStr = correctTheTime(hour, minute);

    let message = element.message
      ? element.message
      : "-----------img or gif-------------";

    // let HTMLcode = `
    //   <div>
    //     <p class="msj-text">${message}</p>
    //     <p class="hidden">${element._serialized}</p>
    //   </div>
    // `;

    let HTMLcode = `
    <div>
      <p class="msj-text">${message}
      <span class="time">${dateStr}</span>
      </p>
      <p class="hidden">${element._serialized}</p>
    </div>
    `;

    if (element.fromMe) {
      //   HTMLcode = `
      //   <div class="on-left">
      //     <p class="msj-text green-color">${message}</p>
      //     <p class="hidden">${element._serialized}</p>
      //   </div>
      // `;

      HTMLcode = `
    <div class="on-left">
      <p class="msj-text green-color">${message}
      <span class="time">${dateStr}</span>
      </p>
      <p class="hidden">${element._serialized}</p>
      
    </div>
    `;
    }
    chatHTML.innerHTML += HTMLcode;
  });

  const arr = rightSide.children;
  for (let i = 0; i < arr.length; ++i) {
    arr[i].classList.remove("hidden");
  }

  chatHTML.scrollTop = chatHTML.scrollHeight;
};

const newFn = () => {
  const parentOfContacts = leftSide;
  parentOfContacts.addEventListener("click", (event) => {
    let clicked = event.target;

    while (
      !clicked.classList.contains("contact") &&
      clicked !== document.documentElement
    )
      clicked = clicked.parentNode;

    if (clicked.classList.contains("contact")) {
      const name = clicked.querySelector(".contact-name");
      chooseContact(clicked, findContacts(name.innerText)[0].number);
    }
  });
};
newFn();

const chooseContact = async (elemHTML, phoneNumber) => {
  const pic1HTML = document.querySelector(".contact-V2 .profile-pic img");
  const pic2HTML = elemHTML.querySelector(".contact .profile-pic img");

  const name1 = document.querySelector(".contact-V2 .contact-name");
  const name2 = elemHTML.querySelector(".contact-name");

  const contactHTML = document.getElementById("contactInformation");
  contactHTML.innerText = phoneNumber;

  pic1HTML.src = pic2HTML.src;
  name1.innerText = name2.innerText;
  // console.log(pic1HTML, pic2HTML, name1, name2);
  await displayTheChat(phoneNumber);
  // await changeTheReceiverNumber(contact.number);
};

// console.time();
let allContacts;
(async () => {
  // console.log(info.id);
  console.log("request-->", "get all contacts");
  allContacts = await Api.getAllContacts(info.apiToken, info.id);
  // console.log(allContacts);

  for (let i = 0; i < allContacts.length; ++i) {
    allContacts[i].profilePicFound = false;
    allContacts[i].pictureUrl =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232";
    //default
  }
  console.log(allContacts);
})();

const findContacts = (phone_name) => {
  const name = phone_name.toLowerCase();
  const regex = new RegExp(`.*${name}.*`, "g");
  const res = allContacts.filter((el) => {
    const str_name = el.name ? el.name : el.pushname;
    if (!str_name) return false;
    return regex.test(str_name.toLowerCase()) || regex.test(el.number);
  });
  return res;
};

const contactOnHTML = async () => {
  const contact = matchingContacts[indexForContacts];
  let url = contact.profilePicFound
    ? contact.pictureUrl
    : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232";

  const name = contact.name ? contact.name : contact.pushname;
  const HTMLcode = `
        <div class="contact">
          <div class="profile-pic">
            <img
              src="${url}"
              alt="profile-pic"
            />
          </div>
          <div class="contact-info">
            <p class="contact-name">${name}</p>
          </div>
        </div>`;
  leftSide.innerHTML += HTMLcode;

  const x = indexForContacts + 1;

  // const contactHTML = document.querySelector(`.contact:nth-child(${x})`);

  ///////////////////////HERE
  // chooseContact(contactHTML, contact);

  const contactPictureHTML = document.querySelector(
    `.contact:nth-child(${x}) .profile-pic img`
  );

  if (contact.profilePicFound == false) {
    console.log("request-->", "profile pic");
    const response = await Api.getProfilePic(
      info.apiToken,
      info.id,
      contact.number
    );
    // console.log(response);
    // if not to many requests to the server
    if (response) {
      contact.pictureUrl = response;
      contact.profilePicFound = true;
      url = response;
      // console.log("picture searched!", url);
    }
  }
  contactPictureHTML.src = url;
};

const showContacts = async (phone_name) => {
  matchingContacts = findContacts(phone_name);
  // console.log(matchingContacts, "matchingContacts");
  await contactOnHTML();
  oneMoreContactBtn.classList.remove("hidden");
};

// const sendMessage = async (phoneNumber, message) => {
//   try {
//     let HTMLcode = `
//       <div class="on-left">
//         <p class="msj-text">${message}</p>
//         <p class="hidden"></p>
//       </div>
//     `;

//     const chatHTML = document.querySelector(".the-chat");
//     chatHTML.innerHTML += HTMLcode;
//     chatHTML.scrollTop = chatHTML.scrollHeight;

//     await changeTheReceiverNumber(phoneNumber);

//     await waitForServerProcessing();

//     console.log("request-->", "send the message");
//     await Api.sendMessage(info.apiToken, info.id, phoneNumber, message);
//     console.log("The message was sent to real Whatsapp");
//   } catch (error) {
//     console.error("Error occurred while sending message:", error);
//   }
// };

// const waitForServerProcessing = () => {
//   return new Promise((resolve) => {
//     const check = () => {
//       if (!isServerProcessing) resolve();
//       else {
//         setTimeout(() => {
//           console.log("wainting...");
//           check();
//         }, 300);
//       }
//     };

//     check();
//   });
// };

const deleteMessage = async (serialized, forEveryone) => {
  await Api.deleteMessage(info.apiToken, info.id, serialized, forEveryone);
};
