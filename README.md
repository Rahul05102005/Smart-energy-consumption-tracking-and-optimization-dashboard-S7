# Energy Wise Dashboard

Build a production-ready full-stack MERN web application named:

"Smart Energy Consumption Tracking and Optimization Dashboard"

The project must be completely software-based.

DO NOT use IoT, sensors, ESP32, Arduino, APIs from smart appliances, or any hardware.

The application should work entirely based on user-provided appliance details.

======================================================

PROJECT OBJECTIVE

======================================================

Develop a web application that allows users to:

• Register/Login securely

• Add household appliances

• Enter appliance power rating (Watts)

• Enter daily usage hours

• Calculate energy consumption (kWh)

• Estimate electricity bills

• View interactive dashboards

• Compare appliance-wise energy consumption

• Receive personalized energy-saving recommendations

• Download energy consumption reports

======================================================

TECH STACK

======================================================

Frontend

---------

React.js

Vite

Tailwind CSS

React Router DOM

Chart.js

React Icons

Backend

--------

Node.js

Express.js

Database

---------

MongoDB Atlas

Mongoose

Authentication

--------------

JWT Authentication

bcrypt password hashing

Deployment

----------

Frontend → Vercel

Backend → Render

======================================================

PROJECT STRUCTURE

======================================================

Frontend

/pages

Login

Register

Dashboard

Appliances

Reports

Profile

Settings

Recommendations

/components

Navbar

Sidebar

Footer

ProtectedRoute

Cards

Charts

Tables

Forms

Loader

Modal

Backend

/controllers

/routes

/models

/middleware

/utils

/config

======================================================

DATABASE COLLECTIONS

======================================================

Users

{

name

email

password

createdAt

}

Appliances

{

userId

applianceName

category

powerRating

dailyUsageHours

quantity

createdAt

}

EnergyRecords

{

userId

applianceId

dailyConsumption

monthlyConsumption

estimatedBill

createdAt

}

Recommendations

{

userId

message

priority

createdAt

}

======================================================

AUTHENTICATION

======================================================

Implement complete JWT authentication.

Features

Register

Login

Logout

Protected Routes

Store JWT securely

Encrypt passwords using bcrypt

======================================================

LOGIN PAGE

======================================================

Modern UI

Left side

Project illustration

Right side

Login form

Email

Password

Remember Me

Forgot Password

Login Button

Register Link

Responsive

======================================================

REGISTER PAGE

======================================================

Fields

Name

Email

Password

Confirm Password

Validation

Email format

Strong password

Duplicate email checking

======================================================

DASHBOARD

======================================================

After login show

Welcome message

Summary Cards

Total Appliances

Today's Consumption

Monthly Consumption

Estimated Bill

Highest Consuming Appliance

Charts

Bar Chart

Pie Chart

Line Chart

Monthly Usage Trend

Recent Activity Table

======================================================

APPLIANCE MANAGEMENT

======================================================

Allow users to

Add Appliance

Edit Appliance

Delete Appliance

Search Appliance

Filter by Category

Fields

Appliance Name

Category

Power Rating (Watts)

Daily Usage Hours

Quantity

======================================================

ENERGY CALCULATION

======================================================

Formula

Energy(kWh)

=

Power Rating × Daily Usage Hours × Quantity

-----------------------------------------------

1000

Monthly Consumption

=

Daily Consumption × 30

Bill

=

Monthly Consumption × Tariff

Tariff should be configurable.

======================================================

REPORTS PAGE

======================================================

Display

Daily Report

Weekly Report

Monthly Report

Highest Consumption

Lowest Consumption

Average Consumption

Export Report as PDF

Export CSV

======================================================

RECOMMENDATION ENGINE

======================================================

Generate recommendations automatically.

Examples

Replace incandescent bulbs with LEDs.

Reduce AC temperature settings.

Turn off unused appliances.

Reduce standby power consumption.

Use energy-efficient appliances.

Recommendations should change depending on appliance usage.

======================================================

PROFILE PAGE

======================================================

Edit Profile

Change Password

View Account Details

======================================================

SETTINGS PAGE

======================================================

Currency

Electricity Tariff

Dark Mode

Notification Preference

======================================================

UI DESIGN

======================================================

Professional

Modern

Responsive

Dashboard Theme

Primary

Green

Blue

White

Rounded Cards

Soft Shadows

Glassmorphism

Smooth Animations

Responsive Sidebar

======================================================

SIDEBAR MENU

======================================================

Dashboard

Appliances

Reports

Recommendations

Profile

Settings

Logout

======================================================

VALIDATIONS

======================================================

Power Rating

Must be positive

Usage Hours

0–24

Quantity

Minimum 1

Email Validation

Password Validation

======================================================

CHARTS

======================================================

Use Chart.js

Bar Chart

Pie Chart

Line Chart

Doughnut Chart

======================================================

SEARCH

======================================================

Search appliances

Filter category

Sort by

Highest Consumption

Lowest Consumption

Recently Added

======================================================

SECURITY

======================================================

JWT

bcrypt

Helmet

Rate Limiting

Input Validation

MongoDB Injection Protection

======================================================

API ENDPOINTS

======================================================

POST

/api/auth/register

POST

/api/auth/login

GET

/api/user/profile

PUT

/api/user/profile

POST

/api/appliances

GET

/api/appliances

PUT

/api/appliances/:id

DELETE

/api/appliances/:id

GET

/api/dashboard

GET

/api/reports

GET

/api/recommendations

======================================================

DASHBOARD FEATURES

======================================================

Show

Total Appliances

Total Daily Units

Total Monthly Units

Estimated Monthly Bill

Highest Consuming Appliance

Most Efficient Appliance

Energy Saving Score

======================================================

FUTURE SCOPE SECTION

======================================================

Include future enhancements

IoT Integration

Smart Meter Integration

Real-Time Monitoring

AI Prediction

Mobile Application

Voice Assistant

======================================================

README

======================================================

Generate complete README

Installation

Folder Structure

API Documentation

Environment Variables

Deployment Steps

Screenshots

======================================================

OUTPUT

======================================================

Generate a complete production-ready MERN application with:

Clean architecture

Reusable React components

Well-structured backend

Professional UI

Proper comments

Best coding practices

Responsive design

Error handling

Validation

Working CRUD

Authentication

Charts

Reports

Download functionality

Ready for GitHub deployment

Ready for Render and Vercel deployment.

The generated code should run without major modifications and follow industry-standard coding practices.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6de7321f-21bc-4946-9238-79e6dc1376ea).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
