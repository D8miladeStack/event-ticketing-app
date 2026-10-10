import { EventBookingSystem } from './booking.js';

const system = new EventBookingSystem("Digital Skillup Conference 2026", 3);

console.log("=== Build 2: Cancellation & Waitlist Promotion Test ===\n");

// 1. Initial Bookings (Filling up the 3-seat capacity)
const aliceBooking = system.bookTicket("Alice", 2);
const bobBooking = system.bookTicket("Bob", 1);
console.log("Alice booked 2 seats:", aliceBooking.referenceCode);
console.log("Bob booked 1 seat:", bobBooking.referenceCode);

// 2. Charlie gets waitlisted since capacity is 3/3
console.log("\nCharlie tries to book 1 seat:");
console.log(system.bookTicket("Charlie", 1));

// 3. Alice cancels her booking
console.log(`\nAlice (${aliceBooking.referenceCode}) cancels her booking...`);
const cancelResult = system.cancelTicket(aliceBooking.referenceCode);
console.log(cancelResult);

// 4. Check updated system state
console.log("\n--- Active Bookings Map (After Cancellation & Promotion) ---");
console.dir(system.bookings);

console.log("\n--- Active Waitlist (Should now be empty) ---");
console.dir(system.waitlist);