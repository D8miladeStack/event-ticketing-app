# 🎫 Event Ticketing and Booking System

An interactive, command-line interface (CLI) event ticketing and booking system built with **Node.js** as a capstone project for **Digital Skillup Africa 2.0**. 

This application manages seat allocations, enforces venue capacity limits, generates unique booking reference codes, handles ticket cancellations, and features an **automated waitlist promotion queue** that instantly moves waitlisted attendees into confirmed slots when seats open up.

---

## ✨ Key Features

* **Interactive CLI Menu**: Built using Node.js native `readline/promises` module for smooth, continuous terminal navigation.
* **Object-Oriented Architecture**: Clean modular design utilizing ES Modules (`import`/`export`), JavaScript `class` syntax, and `Map` data structures for efficient state management.
* **Real-Time Capacity Management**: Validates requested seats against the venue's total capacity before confirming any booking.
* **Automated Waitlist & Promotion**: Automatically routes excess ticket requests to a waitlist queue. When a booking is canceled, the system automatically promotes the next person in line and issues them a fresh reference code.
* **Robust Error Handling**: Gracefully handles invalid reference codes, mistyped inputs, and out-of-bounds menu selections without crashing.

---

## 🚀 Project Structure

```text
event-ticketing-app/
├── booking.js        # Core domain logic (EventBookingSystem class, Maps, waitlist)
├── index.js          # Interactive CLI interface, menu loops, and user prompts
└── package.json      # Project metadata and ES module configuration