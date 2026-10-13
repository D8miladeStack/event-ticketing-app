import express from 'express';
import cors from 'cors';
import { EventBookingSystem } from './booking.js';

const app = express();
app.use(express.json());
app.use(cors());

// Initialize system with a capacity of 100 seats
const system = new EventBookingSystem("Digital Skillup Conference 2026", 100);

// 1. GET: Fetch event status, bookings, and waitlist
app.get('/api/status', (req, res) => {
  let currentTakenSeats = 0;
  for (let booking of system.bookings.values()) {
    currentTakenSeats += booking.seats;
  }
  
  res.json({
    eventName: system.eventName,
    totalCapacity: system.totalCapacity,
    takenSeats: currentTakenSeats,
    availableSeats: system.totalCapacity - currentTakenSeats,
    bookings: Array.from(system.bookings.entries()), // [ [refCode, bookingObj], ... ]
    waitlist: system.waitlist
  });
});

// 2. POST: Book a ticket
app.post('/api/book', (req, res) => {
  const { userName, seats } = req.body;
  if (!userName || !seats) {
    return res.status(400).json({ success: false, message: "Attendee name and seats are required." });
  }

  const result = system.bookTicket(userName.trim(), parseInt(seats, 10));
  res.json(result);
});

// 3. POST: Cancel a ticket & trigger automatic waitlist promotion
app.post('/api/cancel', (req, res) => {
  const { refCode } = req.body;
  if (!refCode) {
    return res.status(400).json({ success: false, message: "Reference code is required." });
  }

  const result = system.cancelTicket(refCode.trim().toUpperCase());
  res.json(result);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Event Ticketing Backend API running on http://localhost:${PORT}`);
});