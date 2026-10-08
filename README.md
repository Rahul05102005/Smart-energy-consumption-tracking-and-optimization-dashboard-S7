# Smart Energy Consumption Tracking and Optimization Dashboard

## Project Overview

Smart Energy Consumption Tracking and Optimization Dashboard is a full-stack MERN web application designed to help users monitor, analyze, and optimize household electricity consumption.

The application works completely through user-provided appliance information. Users can enter appliance details such as power rating, daily usage hours, and quantity. The system calculates energy consumption, estimates electricity bills, provides appliance-wise analysis, and generates personalized energy-saving recommendations.

The project is completely software-based and does not require IoT devices, sensors, smart meters, Arduino, ESP32, or smart appliances.

---

## Objectives

- Provide secure user registration and login.
- Allow users to manage household appliances.
- Calculate daily and monthly energy consumption.
- Estimate electricity bills based on configurable tariff rates.
- Provide interactive dashboards and charts.
- Compare appliance-wise energy consumption.
- Identify high energy-consuming appliances.
- Generate personalized energy-saving recommendations.
- Generate and download energy consumption reports.
- Provide a responsive and user-friendly interface.

---

## Key Features

### Authentication

- User registration
- Secure login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- User-specific data access
- Logout functionality

### Appliance Management

Users can:

- Add appliances
- Edit appliances
- Delete appliances
- Search appliances
- Filter appliances by category
- Sort appliances based on consumption or date

Each appliance contains:

- Appliance name
- Category
- Power rating in watts
- Daily usage hours
- Quantity

### Energy Consumption Calculation

The application calculates energy consumption using:

**Daily Energy Consumption (kWh)**

```text
Power Rating × Daily Usage Hours × Quantity
------------------------------------------------
                     1000