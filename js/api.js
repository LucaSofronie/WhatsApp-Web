async function getData(apiToken) {
  try {
    const data = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + apiToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();

    if (!data.ok) {
      console.log("Error response:", response);
      console.log("There was a problem with the server response");
      return;
    }
    const instance = response.instances[0]; //free trial -> only one
    return instance.id;
  } catch (error) {
    console.log(`We couldn't connect to the server: ${error}`);
  }
}

async function sendMessage(apiToken, id, phoneNumber, yourMessage) {
  const options = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiToken,
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      chatId: phoneNumber + "@c.us",
      message: yourMessage,
    }),
  };

  try {
    const data = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/action/send-message`,
      options
    );
    const response = await data.json();
    // console.log(data);

    if (!(data.status >= 200 && data.status <= 300)) {
      console.log(`There was a problem: ${data.status}`);
      if (data.status == 403)
        console.log(
          "The trial phone number of your account does not match with the chatId of this request!"
        );
      return;
    }

    console.log(response.data.data._data.id._serialized);
    return response.data.data._data.id._serialized;
  } catch (error) {
    return;
  }
}

async function sendMedia(apiToken, id, phoneNumber, mediaURL, mediaCaption) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      chatId: `${phoneNumber}@c.us`,
      mediaUrl: mediaURL,
      mediaCaption: mediaCaption,
    }),
  };

  try {
    const data = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/action/send-media`,
      options
    );
    const response = await data.json();
    console.log(data);

    if (!(data.status >= 200 && data.status <= 300)) {
      console.log(`There was a problem: ${data.status}`);
      return;
    }
    if (response.data.status === "error") {
      console.log(response.data.message);
      return;
    }

    console.log(response);
  } catch (error) {
    console.log("we couldn't connect to the server");
    return;
  }
}

async function getMessages(apiToken, id, phoneNumber, howMany) {
  // you don't have to modify the receiver number
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      chatId: phoneNumber + "@c.us",
      limit: howMany,
    }),
  };
  try {
    const data = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/action/fetch-messages`,
      options
    );
    const response = await data.json();

    if (!(data.status >= 200 && data.status <= 300)) {
      console.log(`There was a problem: ${data.status}`);
      return;
    }

    return response.data.data;

    // const message_serializedArray = [];
    // const size = response.data.data.length;
    // for (let i = 0; i < size; ++i) {
    //   console.log(`${i + 1}) `, response.data.data[i].message.body);
    //   // if (response.data.data[i].message.type === )
    //   console.log("~", response.data.data[i].message.type);
    //   message_serializedArray.push(
    //     response.data.data[i].message.id._serialized
    //   );
    // }
    // return message_serializedArray;
    // console.log(response.data.data[0].message.body);
  } catch (error) {
    console.log("we couldn't connect tho the server or other error:", error);
    return;
  }
}

async function deleteMessage(apiToken, id, message_serialized, forEveryone) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      messageId: message_serialized,
      forEveryone: forEveryone,
    }),
  };

  try {
    const data = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/action/delete-message-by-id`,
      options
    );
    const response = await data.json();

    if (!(data.status >= 200 && data.status <= 300)) {
      console.log(`There was a problem: ${data.status}`);
      return;
    }

    if (response.data.status === "error") {
      console.log(response.data.message);
      return;
    }

    console.log("the message was deleted!");
  } catch (error) {
    console.log(`server error or another one: ${error}`);
  }
}
async function getAllContacts(apiToken, id) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Accept: "application/json",
      "Content-type": "application/json",
    },
  };
  try {
    const url = `https://waapi.app/api/v1/instances/${id}/client/action/get-contacts`;
    const data = await fetch(url, options);
    let response = await data.json();

    if (!(data.status >= 200 && data.status <= 300)) {
      console.log(`There was a problem: ${data.status}`);
      return;
    }

    response = response.data.data.filter((el) => el.id.server !== "lid");
    // console.log(response);

    // console.log(response.data.data); /* array with all the contacts (objects) */
    return response;
  } catch (error) {
    console.log(
      "we couldn't connect to the server or encountered another error:",
      error
    );
    return;
  }
}
//you can get more than one
// async function getBy_Name_Number(apiToken, id, name) {
//   const options = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${apiToken}`,
//       Accept: "application/json",
//       "Content-type": "application/json",
//     },
//   };

//   try {
//     const url = `https://waapi.app/api/v1/instances/${id}/client/action/get-contacts`;
//     const data = await fetch(url, options);
//     const response = await data.json();

//     if (!(data.status >= 200 && data.status <= 300)) {
//       console.log(`There was a problem: ${data.status}`);
//       return;
//     }

// name = name.toLowerCase();
// const regex = new RegExp(`.*${name}.*`, "g");
// const res = response.data.data.filter((el) => {
//   const str_name = el.name ? el.name : el.pushname;
//   if (!str_name) return false;
//   return regex.test(str_name.toLowerCase()) || regex.test(el.number);
// });

//     // console.log(res);
//     return res;
//   } catch (error) {
//     console.log(
//       "we couldn't connect to the server or encountered another error:",
//       error
//     );
//     return;
//   }
// }

//you have to choose one. I chose the first one that came
async function getId_withName(apiToken, id, name) {
  const response = await getByName(apiToken, id, name);
  console.log(response, response[0].id._serialized);
  return response[0].id._serialized;
}

async function getProfilePic(apiToken, id, phoneNumber) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-type": "application/json",
      authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      contactId: phoneNumber + "@c.us",
    }),
  };

  try {
    const data = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/action/get-profile-pic-url`,
      options
    );
    const response = await data.json();

    if (!(data.status >= 200 && data.status <= 300)) {
      console.log(`There was a problem: ${data.status}`);
      return;
    }

    if (response.data.status === "error") {
      console.log(response.data.message);
      return;
    }
    if (response.data.data && response.data.data.profilePicUrl) {
      return response.data.data.profilePicUrl;
    } else {
      // If profilePicUrl doesn't exist, return a default URL
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232";
    }
  } catch (error) {
    console.log(`server error or another one: ${error}`);
  }
}

async function getAllChats(apiToken, id) {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${apiToken}`,
    },
  };

  try {
    const data = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/action/get-chats`,
      options
    );
    const response = await data.json();

    // if (response.data.status === "error" || response.status === "error") {
    //   console.log(response.data.message);
    //   return;
    // }

    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(`The was a problem: ${error}`);
  }
}

(async () => {
  // getAllChats("xUbv3eJgmCVd4pbJq6GYnqEkcpcMSHmufGyzD5S393ba0aa6", "6224");
})();

// for web js
export {
  sendMessage,
  sendMedia,
  getMessages,
  getAllContacts,
  deleteMessage,
  getProfilePic,
  getAllChats,
};

// for node.js
// module.exports = {
//   sendMessage,
//   sendMedia,
//   getMessages,
//   getAllContacts,
//   getProfilePic,
// };
