# Buffs Back-End

Backend RESTful API For Buffs social app

## Built With

- TypeScript
- Node / Express
- Mongoose
- Mocha, Chai and Supertest

## Contribution

If you're contributing to this project, please ask the admin to add you to Doppler.  
Doppler is a platform where we keep our secrets.  
How to set up Doppler in the project after installation: https://docs.doppler.com/docs/install-cli

## Installation

```
# Clone this repository
git clone https://github.com/moaaz-bhnas/camper-api.git

# Go into the repository
cd camper-api

# Install dependencies
npm install

# Set up doppler to dev environment

# Run the app
doppler run -- npm run dev
```

## Database Seeder

To seed the database with users and movies, run

```
# Destroy all data
doppler run -- npx nodemon src/seeders/globalSeeder.ts d

# Import all data
doppler run -- npx nodemon src/seeders/globalSeeder.ts i
```
