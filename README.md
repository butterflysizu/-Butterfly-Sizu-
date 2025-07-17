# 💫 Butterfly🦋 Sizu💟

A smart, multilingual, and customizable Facebook Messenger bot powered by Node.js.  
Made with ❤️ by **Butterfly Sizu💟🦋 & Maruf System💫**

---

## ✨ Features

- Auto-reply & smart commands
- Admin-only features
- Multilingual support
- Fast & easy deployment (GitHub Actions Ready)
- Advanced utility modules (YouTube, error handling, encryption, etc.)
- **Fully rebranded, safe & secure**

---

## 🚀 Get Started

1. **Clone or Fork this repo**
2. **Add your `appstate.json` as a GitHub Secret**  
   (Go to Settings > Secrets > New repository secret > Name: `APPSTATE`)
3. **Configure your bot (optional):** Edit `config.json`, `languages`, or `commands` folder as you wish.
4. **Deploy via GitHub Actions** (auto)

---

## 🛠️ Usage

- To start the bot locally:
  ```bash
  npm install
  node Butterfly.js
### <br>   ❖ DEPLOY_WORKFLOWS ❖
```
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    # Step to check out the repository code
    - uses: actions/checkout@v2

    # Step to set up the specified Node.js version
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}

    # Step to install dependencies
    - name: Install dependencies
      run: npm install

    # Step to run the bot with the correct port
    - name: Start the bot
      env:
        PORT: 8080
      run: npm start
```
