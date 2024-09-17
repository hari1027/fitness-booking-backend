const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let classes = [
  { id: 1, type: 'Yoga', bookedIds: [], waitlistIds: [] , slotsAvailable: 2 , waitlistNumber: 0 , timing: {
    date: '2024-09-18', 
    startTime: '06:00 AM', 
    endTime: '08:30 AM'
  } },
  { id: 2, type: 'Gym', bookedIds: [], waitlistIds: [] , slotsAvailable: 2 , waitlistNumber: 0 , timing: {
    date: '2024-09-18', 
    startTime: '10:00 AM', 
    endTime: '12:30 PM'
  } },
  { id: 3, type: 'Dance', bookedIds: [], waitlistIds: [] , slotsAvailable: 2 , waitlistNumber: 0 , timing: {
    date: '2024-09-18', 
    startTime: '05:00 AM', 
    endTime: '07:30 AM'
  } }
];

let usersWithPhoneNumbersList = [];

// Login route
app.post('/login', (req, res) => {
    const { userId, phoneNumber } = req.body;
    const userExists = usersWithPhoneNumbersList.find(user => user.userId === userId);
    const phoneExists = usersWithPhoneNumbersList.find(user => user.phoneNumber === phoneNumber);

    if (userExists && userExists.phoneNumber === phoneNumber) {
        return res.status(200).json({
            status: true,
            message: 'User already exists'
        });
    }
    else if (userExists && userExists.phoneNumber !== phoneNumber) {
        return res.status(200).json({
            status: false,
            message: 'UserId already taken'
        });
    }
    else if (!userExists && phoneExists) {
        return res.status(200).json({
            status: false,
            message: 'User already exists with this phoneNumber'
        });
    }
    else{
        usersWithPhoneNumbersList.push({ userId, phoneNumber });
        return res.status(200).json({
           status: true,
           message: 'User added successfully'
        });
   }
});

// Get users and phoneNumber
// app.get('/userswithphonenumber', (req, res) => {
//   res.json(usersWithPhoneNumbersList);
// });

// Book a class
app.post('/book', (req, res) => {
  const { userId, classId } = req.body;
  const selectedClass = classes.find(cls => cls.id === classId);

  if (selectedClass.slotsAvailable > 0 ) {
    selectedClass.bookedIds.push(userId);
    selectedClass.slotsAvailable = (selectedClass.slotsAvailable - 1)
    return res.status(200).json({
      status: true,
      message: 'Booking successful'
   });
  } else {
    selectedClass.waitlistIds.push(userId);
    selectedClass.waitlistNumber = (selectedClass.waitlistNumber + 1)
    return res.status(200).json({
      status: true,
      message: 'Class full, added to waitlist'
   });
  }
});

// Cancel a class
app.post('/cancel', (req, res) => {
  const { userId, classId } = req.body;
  const selectedClass = classes.find(cls => cls.id === classId);

  const userIndexInBookedList = selectedClass.bookedIds.indexOf(userId);
  const userIndexInWaitingList = selectedClass.waitlistIds.indexOf(userId);

  if (userIndexInBookedList !== -1) {
    selectedClass.bookedIds.splice(userIndexInBookedList, 1);
    selectedClass.slotsAvailable = (selectedClass.slotsAvailable + 1 );
    if (selectedClass.waitlistNumber > 0) {
      const userId = selectedClass.waitlistIds[0];
      const userIndex = selectedClass.waitlistIds.indexOf(userId)
      selectedClass.waitlistIds.splice(userIndex, 1);
      selectedClass.waitlistNumber = (selectedClass.waitlistNumber - 1)
      selectedClass.bookedIds.push(userId);
      selectedClass.slotsAvailable = (selectedClass.slotsAvailable - 1)
    }
    return res.status(200).json({
      status: true,
      message: 'Booking canceled'
   });
  } else if(userIndexInWaitingList !== -1){
    selectedClass.waitlistIds.splice(userIndexInWaitingList, 1);
    selectedClass.waitlistNumber = (selectedClass.waitlistNumber - 1)
    return res.status(200).json({
      status: true,
      message: 'Your waiting have been canceled'
   });
  } else {
    res.status(400).json({ message: 'User not found in booked list and waiting list' });
  }
});

// Get classes
app.get('/classes', (req, res) => {
  return res.status(200).json({
    status: true,
    classes: classes
 });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
