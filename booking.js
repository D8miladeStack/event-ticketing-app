export class EventBookingSystem {
  constructor(eventName, totalCapacity) {
    this.eventName = eventName;
    this.totalCapacity = totalCapacity;
    this.bookings = new Map(); // Stores referenceCode -> booking details
    this.waitlist = [];
  }

  bookTicket(userName, requestedSeats) {
    if (requestedSeats <= 0 || !Number.isInteger(requestedSeats)) {
      return { success: false, message: "Invalid ticket quantity requested." };
    }

    const currentlyBookedSeats = Array.from(this.bookings.values())
      .reduce((sum, b) => sum + b.seats, 0);

    // Check if capacity is exceeded
    if (currentlyBookedSeats + requestedSeats > this.totalCapacity) {
      this.waitlist.push({ userName, requestedSeats, timestamp: new Date().toISOString() });
      return { success: false, message: `Event sold out! ${userName} added to waitlist.` };
    }

    // Generate unique reference code
    const refCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const booking = { userName, seats: requestedSeats, createdAt: new Date().toISOString() };
    
    this.bookings.set(refCode, booking);

    return { success: true, referenceCode: refCode, booking };
  }

  getBooking(refCode) {
    return this.bookings.get(refCode) || null;
  }
}