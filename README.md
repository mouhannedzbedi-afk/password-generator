# 🔐 Secure Password Generator

A modern, client-side password generator built with **HTML, CSS and Vanilla JavaScript**, designed as an IT portfolio project.

The application generates customizable passwords directly in the browser using the **Web Crypto API**, without sending passwords to a server.

## 🚀 Live Demo

**[View Live Demo](YOUR-NETLIFY-LINK)**

## ✨ Features

* 🔐 Cryptographically secure password generation
* 📏 Custom password length
* 🔤 Uppercase and lowercase letters
* 🔢 Numbers
* 🔣 Special characters
* 🚫 Exclude similar characters (`0`, `O`, `I`, `l`, `1`)
* 📊 Password strength analysis
* 🧮 Theoretical entropy estimation
* ⏱️ Estimated offline brute-force time
* 📋 Copy password to clipboard
* 👁️ Show / hide password
* ⚡ Quick password presets
* 📱 Responsive design
* ♿ Accessibility-focused interface

## 🛡️ Security

The password generator uses the browser's **Web Crypto API** with `crypto.getRandomValues()` instead of `Math.random()`.

A rejection-sampling approach is used to avoid modulo bias when generating random indexes.

Passwords are generated **locally in the browser** and are not sent to a server.

> The displayed brute-force time is only an estimate based on an assumed attack rate and should not be interpreted as a guarantee of real-world security.

## 🧠 How It Works

1. The user selects the desired password length.
2. Character sets are selected according to the user's preferences.
3. Secure random values are generated using `crypto.getRandomValues()`.
4. At least one character from each selected character set is included.
5. The generated characters are shuffled using a cryptographically secure Fisher-Yates shuffle.
6. The application calculates theoretical entropy and displays a security estimate.
7. The password can be copied directly to the clipboard.

## 🛠️ Technologies

* HTML5
* CSS3
* Vanilla JavaScript
* Web Crypto API
* Clipboard API
* Responsive CSS
* CSS Variables

## 📂 Project Structure

```text
password-generator/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 📚 What I Learned

Through this project, I practiced:

* JavaScript DOM manipulation
* Event handling
* Secure random number generation
* Web Crypto API
* Password security concepts
* Entropy calculation
* Input validation
* Clipboard API
* Responsive web design
* Accessibility
* Clean code organization

## 🎯 Project Goal

This project was created as part of my IT portfolio to demonstrate practical skills in **web development, JavaScript and basic cybersecurity concepts**.

## 👨‍💻 Author

**Mouhaned Zbedi**

Aspiring Fachinformatiker
Tunisia 🇹🇳 → Germany 🇩🇪

---

⭐ If you find this project useful, feel free to give it a star.
