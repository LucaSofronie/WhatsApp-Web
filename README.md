# WhatsApp Clone

<img src="https://cdn.pixabay.com/photo/2021/05/24/17/07/whatsapp-6279868_1280.png" alt="WhatsApp Logo" width="400" height="400">

## Overview

This project is a WhatsApp clone built using the WhatsApp API (WaAPI) service. It enables users to send and receive messages in real-time, mimicking the functionality of WhatsApp.

## Features

- Real-time messaging using the WaAPI service.
- Simple and intuitive user interface akin to WhatsApp.
- Capability to send messages to individual contacts.
- Automatic synchronization with WaAPI for a seamless messaging experience.

## How to Setup the WhatsApp Clone

Follow these steps to set up the WhatsApp clone:

1. **Create a WaAPI Account:**
   - Go to [waapi.app](https://waapi.app) and sign up for an account.
   - Select the Free Trial option and create an instance.
   - Scan the QR code to obtain the trial instance code (e.g., #6630).
   - When setting up the trial instance, ensure to include your phone number with the country code followed by `@c.us` (e.g., `1234567890@c.us`). This will serve as the static receiver for your trial account.

2. **Generate API Token:**
   - After creating the instance, generate an API token.
   - Copy the API token for later use.

3. **Configure Personal Information:**
   - Clone the repository:
     ```bash
     git clone https://github.com/LucaSofronie/WhatsApp-Web.git
     ```
   - Initialize the submodule:
     ```bash
     git submodule update --init
     ```
   - Open the `personal_info.js` and `personal_infoNode.js` files in your project directory.
   - Paste your API token, instance code, email, and password into the respective files.

4. **Run the Node.js Server:**
   - Open the terminal and navigate to your project directory.
   - Run the Node.js server using the command:
     ```bash
     node server.js
     ```

5. **Run the Application:**
   - Open the `index.html` file in your web browser.
   - Start using the WhatsApp clone to send and receive messages.

## Contributing

Contributions to the WhatsApp clone project are welcome! If you'd like to contribute, please follow these guidelines:

1. **Fork the Repository:**
   - Fork the repository to your GitHub account.

2. **Create Your Branch:**
   - Create a new branch to work on your changes.

3. **Make Changes:**
   - Make your changes to the codebase.
   - Ensure that your code is properly tested to maintain code quality.

4. **Submit Pull Request:**
   - Once your changes are ready, submit a pull request to the main repository.
   - Provide a detailed description of your changes and improvements in the pull request.

Thank you for considering contributing to the WhatsApp clone project!
