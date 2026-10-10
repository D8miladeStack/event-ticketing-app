export class EventBookingSystem {
  constructor(eventName, totalCapacity) {
    this.eventName = eventName;
    this.totalCapacity = totalCapacity;
    this.bookings = new Map(); // Stores active bookings: refCode -> booking object
    this.waitlist = [];        // Stores waitlisted users: Array of objects
  }

  bookTicket(userName, requestedSeats) {
    // Calculate currently taken seats
    let currentTotalSeats = 0;
    for (let booking of this.bookings.values()) {
      currentTotalSeats += booking.seats;
    }

    // Check if adding this booking exceeds capacity
    if (currentTotalSeats + requestedSeats > this.totalCapacity) {
      // Add to waitlist
      this.waitlist.push({
        userName,
        requestedSeats,
        timestamp: new Date().toISOString()
      });
      return {
        success: false,
        message: `Event sold out! ${userName} added to waitlist.`
      };
    }

    // Generate reference code
    const refCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const booking = {
      userName,
      seats: requestedSeats,
      createdAt: new Date().toISOString()
    };

    this.bookings.set(refCode, booking);
    return { success: true, referenceCode: refCode, booking };
  }

  getBooking(refCode) {
    return this.bookings.get(refCode) || null;
  }

  cancelTicket(refCode) {
    // Check if the booking exists
    if (!this.bookings.has(refCode)) {
      return { success: false, message: "Invalid reference code. Booking not found." };
    }

    const cancelledBooking = this.bookings.get(refCode);
    this.bookings.delete(refCode); // Remove the booking from the Map

    let promotedUser = null;

    // If there are people on the waitlist, automatically promote the first one
    if (this.waitlist.length > 0) {
      const nextInLine = this.waitlist.shift(); // Remove the first person from waitlist array
      
      // Generate a new reference code for them
      const newRefCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newBooking = { 
        userName: nextInLine.userName, 
        seats: nextInLine.requestedSeats, 
        createdAt: new Date().toISOString() 
      };
      
      this.bookings.set(newRefCode, newBooking);
      promotedUser = { referenceCode: newRefCode, booking: newBooking };
    }

    return { 
      success: true, 
      message: `Successfully canceled booking for ${cancelledBooking.userName}. Seat capacity freed up.`, 
      promotedUser 
    };
  }
}