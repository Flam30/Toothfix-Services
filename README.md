# BANCs

## Table of contents

1. [Description of services](#description-of-services)
2. [How to run the services](#how-to-run-the-services)
3. [Ports](#ports)

## Introduction

BANCs stands for Booking, Availability, and Notification systems. These services are completely independent and communicate to eachother via MQTT.

BANCs controls the backend operations of Toothfix. To communicate to the frontend, BANCs does it via HTTP requests to the [API Delegator](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/api-delegator). The delegator will also decide which service to send the webpage's request to.

## Description of Services

- [Availability](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/bancs/-/tree/main/availability-service?ref_type=heads):

  - This service is responsible for keeping track of the availability of the dentists. Dentists will be able to set their available times and this service will keep track of it and communicate it to the booking service so that users can book available apointments.

- [Booking](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/bancs/-/tree/main/booking-service?ref_type=heads):

  - This service is one of the most important ones for our system. It is responsible for keeping track of the bookings made by the users.
  - The service has the responsibility of sending the available times to the frontend so that the user can choose a time to book.
  - It will also communicate with the availability service to make sure that the booking is possible.
  - Whenever a booking is made, this service will send a message to the notification service to notify the user of the booking.
  - This service will also manage the cancelations of bookings by users or dentists.
  - Note: redis needs to be running locally on port 6379 for this service to work.

- [Notification](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/bancs/-/tree/main/notification-service?ref_type=heads):
  - This service is responsible for sending notifications to the users whenever they make a book.
  - The service will also send a notification to the user if the booking is canceled.
  - The service will also send a notification to the dentist if a booking is made.

- [Logging](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/bancs/-/tree/main/logging-service?ref_type=heads):
  - This service is responsible for keeping track of the important actions made in our system.
  - The service will log into a database whenever a booking is made or canceled and when new slots become available.
  - The service also provides a way of getting the logs to see statistics of the system.

## How to run the services 
*Note: To have our entire system running, you will also need to run the [API Delegator](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/api-delegator) and the [Frontend](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/patient-interface).*

Now, for running the services:
1. Clone the repository and open the root folder, you will see all the folders for the services.
2. If you are using windows you can run the `servicesrunner.bat` file to run all the services at once. 
If not, you will have to run each service individually. To do so, open a terminal in the root folder of the service you want to run and execute the following commands:

    - `npm install`
    - `npm start` 

Repeat this for each service.

## How to see the load of our system

1. Make sure that you have all the services running **including the logging service**
2. Open a terminal in the root folder of the logging service and execute the following command:
    - `npm install -g`
    - Now you can use `stats` to see the full list of commands that you can execute.


## Ports

- `booking - 3001`
- `availability - 3002`
- `notification - 3003`
- `logging - 3011`