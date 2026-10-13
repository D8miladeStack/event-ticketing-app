import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { EventBookingSystem } from './booking.js';

// Initialize readline interface and event system (capacity of 3 seats)
const rl = readline.createInterface({ input, output });
const system = new EventBookingSystem("Digital Skillup Conference 2026", 3);

async function promptMenu() {
  console.log(`\n========================================`);
  console.log(`   ${system.eventName} - Management System`);
  console.log(`========================================`);
  console.log("1. Book Ticket");
  console.log("2. Cancel Ticket");
  console.log("3. View Event Status & Waitlist");
  console.log("4. Exit");

  const choice = await rl.question("\nChoose an option (1-4): ");

  switch (choice.trim()) {
    case '1':
      await handleBookTicket();
      break;
    case '2':
      await handleCancelTicket();
      break;
    case '3':
      handleViewStatus();
      break;
    case '4':
      console.log("\nExiting Event Booking System. Goodbye!");
      rl.close();
      return;
    default:
      console.log("\n❌ Invalid option. Please choose a number between 1 and 4.");
  }

  // Loop back to the menu unless exited
  promptMenu();
}

async function handleBookTicket() {
  const name = await rl.question("Enter attendee name: ");
  const seatsInput = await rl.question("Enter number of seats to book: ");
  const seats = parseInt(seatsInput, 10);

  if (isNaN(seats) || seats <= 0) {
    console.log("\n❌ Invalid seat number. Please enter a valid positive integer.");
    return;
  }

  const result = system.bookTicket(name.trim(), seats);
  if (result.success) {
    console.log(`\n✅ Booking successful!`);
    console.log(`Reference Code: ${result.referenceCode}`);
  } else {
    console.log(`\n⚠️ ${result.message}`);
  }
}

async function handleCancelTicket() {
  const refCode = await rl.question("Enter reference code to cancel (e.g., REF-XXXXXX): ");
  const result = system.cancelTicket(refCode.trim().toUpperCase());

  if (result.success) {
    console.log(`\n✅ ${result.message}`);
    if (result.promotedUser) {
      console.log(`🎉 Waitlist Promotion! ${result.promotedUser.booking.userName} has been promoted from the waitlist.`);
      console.log(`New Reference Code: ${result.promotedUser.referenceCode}`);
    }
  } else {
    console.log(`\n❌ ${result.message}`);
  }
}

function handleViewStatus() {
  let currentTakenSeats = 0;
  for (let booking of system.bookings.values()) {
    currentTakenSeats += booking.seats;
  }

  console.log(`\n--- Event Status ---`);
  console.log(`Event Name: ${system.eventName}`);
  console.log(`Total Capacity: ${system.totalCapacity}`);
  console.log(`Seats Taken: ${currentTakenSeats}`);
  console.log(`Available Seats: ${system.totalCapacity - currentTakenSeats}`);
  
  console.log(`\nActive Bookings (${system.bookings.size}):`);
  if (system.bookings.size === 0) {
    console.log("  (None)");
  } else {
    for (let [code, booking] of system.bookings.entries()) {
      console.log(`  - [${code}] ${booking.userName}: ${booking.seats} seat(s)`);
    }
  }

  console.log(`\nWaitlist Queue (${system.waitlist.length}):`);
  if (system.waitlist.length === 0) {
    console.log("  (None)");
  } else {
    system.waitlist.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.userName} — Requested ${item.requestedSeats} seat(s)`);
    });
  }
}

// Start the interactive terminal application
promptMenu();