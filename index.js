import { EventBookingSystem } from './booking.js';

// Create an event with a maximum capacity of 3 seats
const system = new EventBookingSystem("Digital Skillup Conference 2026", 3);

console.log("=== Build 1: Core Domain Execution ===\n");

// 1. Test Valid Bookings
console.log("1. Alice books 2 seats:");
console.log(system.bookTicket("Alice", 2));

console.log("\n2. Bob books 1 seat:");
console.log(system.bookTicket("Bob", 1));

// 3. Test Over-Capacity / Waitlist (Capacity is full, so Charlie should be waitlisted)
console.log("\n3. Charlie tries to book 1 seat (should trigger waitlist):");
console.log(system.bookTicket("Charlie", 1));

console.log("\n--- Active Bookings (Map) ---");
console.dir(system.bookings);

console.log("\n--- Active Waitlist ---");
console.dir(system.waitlist);