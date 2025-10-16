<p align="center">
  <img src="docs/logo.png" alt="Logo do Projeto" width="900">
</p>

<h1 align='center'>Safelock - Credential Manager</h1> 

![Status do Projeto](https://img.shields.io/badge/status-unfinished-pink?style=for-the-badge)

<p align='center'>A website based on Express + React, created with the goal of practicing web knowledge. The project is based on a shared credential manager. Users are free to create vaults to store credentials and share them with whomever they want. In addition (not yet implemented), users can also store credit card information and documents, such as receipts and proof of purchase, with the same freedom to share them. Finally, the application provides a generator for passwords, secret phrases and usernames (Gemini API).</p>
<br/>


# 🎯 Shortcuts 
  - [Backend Routes](backend/routes)
  - [Backend Models](backend/models)
  - [Frontend Services](frontend/src/services)
  - [Frontend Assets](frontend/src/assets)
  - [Frontend Pages](frontend/src/pages)
  - [Frontend Full Components](frontend/src/components/full)
  - [Frontend Partial Components](frontend/src/components/partials)
<br/>

# 🧩 Previews and Features

## Home Page
<p align="center">
  <img src="docs/home.png" alt="Logo do Projeto" width="900">
</p>

## Dashboard -> Vaults
<p align="center">
  <img src="docs/vaults.png" alt="Logo do Projeto" width="900">
</p>

## Vault Modal
<p align="center">
  <img src="docs/vault-info.png" alt="Logo do Projeto" width="900">
</p>
<br/>

## Dashboard -> Generate Username
<p align="center">
  <img src="docs/gen-username.png" alt="Logo do Projeto" width="900">
</p>

# 🧰 Toolbox
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=express,nodejs,mongodb,javascript,react,bootstrap,html,css,git,postman," />
  </a>
</p>
<br/>

# 🚀 How to Run
<p>To run this project, you need to have <a href='https://nodejs.org/'>NodeJS</a> installed on your machine, an account with <a href='https://www.mongodb.com/products/platform/atlas-database'>MongoDB Atlas</a> and
a <a href='https://ai.google.dev/gemini-api/docs'>Gemini API Key</a>.</p>

## 1. Clone the repository

```
 git clone https://github.com/VorAd2/safelock-pass-manager
 cd safelock-pass-manager
```

## 2. Install dependencies
```
cd backend
npm install
```
```
cd frontend
npm install
```

## 3. Create the .env files
Check the .env.template files in [backend](/backend/.env.template) and [frontend](/frontend/.env.template) and fill in the variables.

## 4. Run !!
```
  cd backend
  npm run dev
```

```
  cd frontend
  npm run dev
```
