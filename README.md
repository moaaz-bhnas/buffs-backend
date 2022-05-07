# Camper API

Backend RESTful API For Bootcamp Directory App

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Live

https://camper-api-production.herokuapp.com/

Extensive documentation with examples: [documenter.getpostman](https://documenter.getpostman.com/view/5058453/UVyxPCwG)

## Built With

- TypeScript
- Node / Express
- Mongoose
- Mocha, Chai and Supertest

## Installation

```
# Clone this repository
git clone https://github.com/moaaz-bhnas/camper-api.git

# Go into the repository
cd camper-api

# Install dependencies
npm install

# Run the app
npm run dev
```

## Database Seeder

To seed the database with users, bootcamps and courses data from the "\_data" folder, run

```
# Destroy all data
npx nodemon src/seeder d

# Import all data
npx nodemon src/seeder i
```
