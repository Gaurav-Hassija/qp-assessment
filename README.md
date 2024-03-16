## Description

Grocery List API Assessment for QP

## Prerequisite

1. Install nodejs version 18 or above
2. Install docker
3. Inside project root directory run command "docker compose up"
4. Inside project root directory run command "npm run migration:up"

# Seed Initial Data For Role Table And Add Admin User

1. Find the postman collection inside the postman_collection folder
2. Run seed api in order to seed data for roles table in database
3. Run seed user api to add admin user to db and perform all admin activites using the user phone_number returned as response

# Api Flow

1. Sign in to generate otp
2. Verify otp to generate token
3. Insert Category using admin credentials
4. Insert items into categories using admin credentials
5. Place order, get all orders via user login
