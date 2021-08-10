## About

This is an web application with which lots of people can manage their own expenses and revenues. Below are the implemented features:

- Sign Up
- Login
- List all financial events for a user
- Add expense
- Add revenue

By using this app any user can learn how they've been using their money and always keep track of your balance.

## Technologies
The following tools and frameworks were used in the construction of the project:<br>
<p>
  <img style='margin: 5px;' src='https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white'>
</p>

## How to run

1. Clone this repository
2. Clone the front-end repository at https://github.com/carvares/mywallet-front
3. Follow instructions to run front-end at https://github.com/carvares/mywallet-front
4. Install dependencies
```bash
npm i
```
5. Create the database using the dump.sql file
```bash
psql --set ON_ERROR_STOP=on mywallet < dump.sql
```
6. Run the back-end with
```bash
npm run dev
```
7. You can optionally build the project running
```bash
npm run build
```
8. Finally the back-end is running
