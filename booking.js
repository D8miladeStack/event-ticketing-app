import fs from 'fs';

export class EventBookingSystem {
  constructor(eventName, totalCapacity, dataFile = 'ticketing-data.json') {
    this.eventName = eventName;
    this.totalCapacity = totalCapacity;
    this.dataFile = dataFile;
    this.bookings = new Map(); // Stores active bookings: refCode -> booking object
    this.waitlist = [];        // Stores waitlisted users: Array of objects
    
    // Load existing data from file when system initializes
    this.loadData();
  }

  saveData() {
    try {
      const data = {
        eventName: this.eventName,
        totalCapacity: this.totalCapacity,
        bookings: Array.from(this.bookings.entries()), // Convert Map to Array for JSON storage
        waitlist: this.waitlist
      };
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving data to file:", error.message);
    }
  }

  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const fileData = fs.readFileSync(this.dataFile, 'utf8');
        const parsed = JSON.parse(fileData);
        this.eventName = parsed.eventName || this.eventName;
        this.totalCapacity = parsed.totalCapacity || this.totalCapacity;
        this.bookings = new Map(parsed.bookings || []); // Convert Array back to Map
        this.waitlist = parsed.waitlist || [];
      }
    } catch (error) {
      console.error("Error loading data from file:", error.message);
    }
  }

  bookTicket(userName, requestedSeats) {
    let currentTotalSeats = 0;
    for (let booking of this.bookings.values()) {
      currentTotalSeats += booking.seats;
    }

    if (currentTotalSeats + requestedSeats > this.totalCapacity) {
      this.waitlist.push({
        userName,
        requestedSeats,
        timestamp: new Date().toISOString()
      });
      this.saveData(); // Auto-save after state change
      return {
        success: false,
        message: `Event sold out! ${userName} added to waitlist.`
      };
    }

    const refCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const booking = {
      userName,
      seats: requestedSeats,
      createdAt: new Date().toISOString()
    };

    this.bookings.set(refCode, booking);
    this.saveData(); // Auto-save after state change
    return { success: true, referenceCode: refCode, booking };
  }

  getBooking(refCode) {
    return this.bookings.get(refCode) || null;
  }

  cancelTicket(refCode) {
    if (!this.bookings.has(refCode)) {
      return { success: false, message: "Invalid reference code. Booking not found." };
    }

    const cancelledBooking = this.bookings.get(refCode);
    this.bookings.delete(refCode);

    let promotedUser = null;

    if (this.waitlist.length > 0) {
      const nextInLine = this.waitlist.shift();
      const newRefCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newBooking = { 
        userName: nextInLine.userName, 
        seats: nextInLine.requestedSeats, 
        createdAt: new Date().toISOString() 
      };
      
      this.bookings.set(newRefCode, newBooking);
      promotedUser = { referenceCode: newRefCode, booking: newBooking };
    }

    this.saveData(); // Auto-save after state change
    return { 
      success: true, 
      message: `Successfully canceled booking for ${cancelledBooking.userName}. Seat capacity freed up.`, 
      promotedUser 
    };
  }
}