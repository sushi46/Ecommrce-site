
const calculateEarnings = (orders) => {
    let totalSales = 0;
    let grossRevenue = 0;
  
    orders.forEach(order => {
      totalSales += order.totalPrice; 
      grossRevenue += order.totalPrice; 
    });
  
    // Store takes 5% of total sales
    const storeEarnings = totalSales * 0.05;
  
    // Seller's net revenue
    const sellerNetRevenue = grossRevenue - storeEarnings;
  
    return {
      totalSales,
      grossRevenue,
      storeEarnings,
      sellerNetRevenue
    };
};


const getStartDateAndEndDdate = async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Normalize today's time

    if (today <= endOfDay) {
        throw new Error("Daily data unavailable for the current day. Please check after the day ends.");
    }
    
    return {startOfDay, endOfDay}
} 


const getStartweekAndEndWeek = async (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
  
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + (6 - date.getDay())); // End of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);
  
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Normalize today's time
  

    if (today <= endOfWeek) {
      throw new Error("Weekly data unavailable for the current week. Please check after the week ends.");
    }

    return {startOfWeek, endOfWeek}

};
  



const getStartMonthAndEndMonth = async (year, month) => {
    const startOfMonth = new Date(year, month - 1, 1); // Month is 0-indexed
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(year, month, 0); // Last day of the month
    endOfMonth.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Normalize today's time

   
    if (today <= endOfMonth) {
        throw new Error("Monthly data unavailable for the current month. Please check after the month ends.");
    }
  
    return {startOfMonth, endOfMonth}
};


export {calculateEarnings, getStartDateAndEndDdate, getStartweekAndEndWeek, getStartMonthAndEndMonth}