import profile_pic from './profile_pic.png'
import dropdown_icon from './dropdown_icon.svg'
import hotel1 from './hotel1.jpg'
import hotel2 from './hotel2.jpg'
import hotel3 from './hotel3.jpeg'
import hotel4 from './hotel4.jpg'
import hotel5 from './hotel5.jpg'
import userIcon from './user-icon.jpg'
// events
import event1 from './event1.jpg'
import event2 from './event2.jpg'
import event3 from './event3.jpeg'
import event4 from './event4.jpg'
import event5 from './event5.jpeg'

// trips
import trip1 from './trip1.jpeg'
import trip2 from './trip2.jpg'
import trip3 from './trip3.jpeg'
import trip4 from './trip4.jpg'
import trip5 from './trip5.avif'



export const assets = {
    profile_pic,
    dropdown_icon,
    userIcon
   
}

export const hotels = [
    {
        id: 1,
        name: 'Hotel 1',
        image: hotel1,
        price: '$100 for 2 nights',
    },
    {
        id: 2,
        name: 'Hotel 2',
        image: hotel2,
        price: '$300 for 3 nights',

    },
    {
        id: 3,
        name:'Hotel 3',
        image:hotel3,
        price: '$200 for 4 nights',

    },
    {
        id: 4,
        name:'Hotel 4',
        image:hotel4,
        price: '$90 for 1 night',
    },
    {
        id: 5,
        name:'Hotel 5',
        image:hotel5,
        price: '$150 for 2 nights',
    }
    
]

export const events = [
    {
        id: 1,
        name: 'Event 1',
        image: event1,
        date: '2025-06-01',
        location: 'New York',
    },
    {
        id: 2,
        name: 'Event 2',
        image: event2,
        date: '2025-06-02',
        location: 'Los Angeles',
    },
    {
        id: 3,
        name: 'Event 3',
        image: event3,
        date: '2025-06-03',
        location: 'Chicago',
    },
    {
        id: 4,
        name: 'Event 4',
        image: event4,
        date: '2025-06-04',
        location: 'San Francisco',
    },
    {
        id: 5,
        name: 'Event 5',
        image: event5,
        date: '2025-06-05',
        location: 'Miami',
    }
    
]

export const trips = [
    {
        id: 1,
        name: 'Trip 1',
        image: trip1,
        price: '$100 for 2 days',
        
    },
    {
        id: 2,
        name: 'Trip 2',
        image: trip2,
        price: '$100 for 2 days',
        
    },
    {
        id: 3,
        name: 'Trip 3',
        image: trip3,
        price: '$400 for 2 days',
    },
    {
        id: 4,
        name: 'Trip 4',
        image: trip4,
        price: '$600 for 2 days',
    },
    {
        id: 5,
        name: 'Trip 5',
        image: trip5,
        price: '$800 for 5 days',
    },
    {
        id: 6,
        name: 'Trip 6',
        image: trip3,
        price: '$1000 for 7 days',
    },
    {
        id: 7,
        name: 'Trip 7',
        image: trip4,
        price: '$1200 for 10 days',
    },
    {
        id: 8,
        name: 'Trip 8',
        image: trip5,
        price: '$1400 for 14 days',
    },

    
    
]

export const flights = [
    {
      "id": 1,
      "airline": "Qatar Airways",
      "flightNumber": "QR739",
      "departure": {
        "airport": "Hamad International Airport",
        "iata": "DOH",
        "city": "Doha",
        "time": "2025-07-15T08:30:00Z"
      },
      "arrival": {
        "airport": "John F. Kennedy International Airport",
        "iata": "JFK",
        "city": "New York",
        "time": "2025-07-15T16:45:00Z"
      },
      "duration": "14h 15m",
      "price": {
        "amount": 950,
        "currency": "USD"
      },
      "image": "https://www.signatureluxurytravel.com.au/wp-content/uploads/2024/04/Adobe-Stockevgenydrablenkov.jpg",
      "class": "Economy",
      "stops": "Non-stop"
    },
    {
      "id": 2,
      "airline": "Emirates",
      "flightNumber": "EK202",
      "departure": {
        "airport": "Dubai International Airport",
        "iata": "DXB",
        "city": "Dubai",
        "time": "2025-08-03T02:10:00Z"
      },
      "arrival": {
        "airport": "London Heathrow Airport",
        "iata": "LHR",
        "city": "London",
        "time": "2025-08-03T06:55:00Z"
      },
      "duration": "7h 45m",
      "price": {
        "amount": 730,
        "currency": "USD"
      },
      "image": "https://blog.newlaunchproperties.ae/wp-content/uploads/2025/02/eeflyqn9pvsgxoewqjmj.jpg",
      "class": "Business",
      "stops": "Non-stop"
    },
    {
      "id": 3,
      "airline": "Turkish Airlines",
      "flightNumber": "TK1951",
      "departure": {
        "airport": "Istanbul Airport",
        "iata": "IST",
        "city": "Istanbul",
        "time": "2025-09-10T12:20:00Z"
      },
      "arrival": {
        "airport": "Amsterdam Schiphol Airport",
        "iata": "AMS",
        "city": "Amsterdam",
        "time": "2025-09-10T15:00:00Z"
      },
      "duration": "2h 40m",
      "price": {
        "amount": 310,
        "currency": "USD"
      },
      "image": "https://images.ctfassets.net/biom0eqyyi6b/7wIGbIkDkbUHr5C3aetf4R/ae809427a6c28ce8cf2fcb438d2c6e6a/royal_schiphol_group_hero_ascending.jpg",
      "class": "Economy",
      "stops": "Non-stop"
    },
    {
      "id": 4,
      "airline": "Lufthansa",
      "flightNumber": "LH400",
      "departure": {
        "airport": "Frankfurt Airport",
        "iata": "FRA",
        "city": "Frankfurt",
        "time": "2025-10-01T13:30:00Z"
      },
      "arrival": {
        "airport": "John F. Kennedy International Airport",
        "iata": "JFK",
        "city": "New York",
        "time": "2025-10-01T16:20:00Z"
      },
      "duration": "8h 50m",
      "price": {
        "amount": 820,
        "currency": "USD"
      },
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9K14DmsDUcsRRVfT_Yb6s3gBYbXy4Nc8uDQ&s",
      "class": "Premium Economy",
      "stops": "Non-stop"
    },
    {
      "id": 5,
      "airline": "Ethiopian Airlines",
      "flightNumber": "ET302",
      "departure": {
        "airport": "Addis Ababa Bole International Airport",
        "iata": "ADD",
        "city": "Addis Ababa",
        "time": "2025-11-20T06:10:00Z"
      },
      "arrival": {
        "airport": "Heathrow Airport",
        "iata": "LHR",
        "city": "London",
        "time": "2025-11-20T13:30:00Z"
      },
      "duration": "8h 20m",
      "price": {
        "amount": 640,
        "currency": "USD"
      },
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUvn9dhVwN0bUh2ywOE90BXHMiJaWyg0hEkg&s",
      "class": "Economy",
      "stops": "1 Stop"
    },
    {
      "id": 6,
      "airline": "RwandAir",
      "flightNumber": "WB110",
      "departure": {
        "airport": "Kigali International Airport",
        "iata": "KGL",
        "city": "Kigali",
        "time": "2025-12-05T07:00:00Z"
      },
      "arrival": {
        "airport": "Jomo Kenyatta International Airport",
        "iata": "NBO",
        "city": "Nairobi",
        "time": "2025-12-05T09:10:00Z"
      },
      "duration": "2h 10m",
      "price": {
        "amount": 180,
        "currency": "USD"
      },
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjqjasDUQk4_9l9qVMDZTfWw7kB-pBadfshZ935UdrvVTyCS7afx41Lbj-7D7NuzadDx4&usqp=CAU",
      "class": "Economy",
      "stops": "Non-stop"
    }
  ]
  
  
  