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

- [Notification](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/bancs/-/tree/main/notification-service?ref_type=heads):
  - This service is responsible for sending notifications to the users whenever they make a book. 
  - The service will also send a notification to the user if the booking is canceled.
  - The service will also send a notification to the dentist if a booking is made. 

## How to run the services 
*Note: To have our entire system running, you will also need to run the [API Delegator](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/api-delegator) and the [Frontend](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-06/patient-interface).*

Now, run the services:

### Windows
1. Clone the repository and open the root folder, you will see all the folders for the services.
2. Execute `servicesrunner.bat` to run all the services at once.

### Linux
@carlos

## Ports
- `booking - 3001`
- `availability - 3002`
- `notification - 3003`