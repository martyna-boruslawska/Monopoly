# Monopoly Properties

```js
export const monopolyProperties = [
  {
    name: "Mediterranean Avenue",
    price: 60,
    rent: 2,
    rent1House: 10,
    rent2Houses: 30,
    rent3Houses: 90,
    rent4Houses: 160,
    rentHotel: 250,
  },
  {
    name: "Baltic Avenue",
    price: 60,
    rent: 4,
    rent1House: 20,
    rent2Houses: 60,
    rent3Houses: 180,
    rent4Houses: 320,
    rentHotel: 450,
  },
  {
    name: "Oriental Avenue",
    price: 100,
    rent: 6,
    rent1House: 30,
    rent2Houses: 90,
    rent3Houses: 270,
    rent4Houses: 400,
    rentHotel: 550,
  },
  {
    name: "Vermont Avenue",
    price: 100,
    rent: 6,
    rent1House: 30,
    rent2Houses: 90,
    rent3Houses: 270,
    rent4Houses: 400,
    rentHotel: 550,
  },
  {
    name: "Connecticut Avenue",
    price: 120,
    rent: 8,
    rent1House: 40,
    rent2Houses: 100,
    rent3Houses: 300,
    rent4Houses: 450,
    rentHotel: 600,
  },


  {
    name: "St. Charles Place",
    price: 140,
    rent: 10,
    rent1House: 50,
    rent2Houses: 150,
    rent3Houses: 450,
    rent4Houses: 625,
    rentHotel: 750,
  },
  {
    name: "States Avenue",
    price: 140,
    rent: 10,
    rent1House: 50,
    rent2Houses: 150,
    rent3Houses: 450,
    rent4Houses: 625,
    rentHotel: 750,
  },
  {
    name: "Virginia Avenue",
    price: 160,
    rent: 12,
    rent1House: 60,
    rent2Houses: 180,
    rent3Houses: 500,
    rent4Houses: 700,
    rentHotel: 900,
  },
  {
    name: "St. James Place",
    price: 180,
    rent: 14,
    rent1House: 70,
    rent2Houses: 200,
    rent3Houses: 550,
    rent4Houses: 750,
    rentHotel: 950,
  },
  {
    name: "Tennessee Avenue",
    price: 180,
    rent: 14,
    rent1House: 70,
    rent2Houses: 200,
    rent3Houses: 550,
    rent4Houses: 750,
    rentHotel: 950,
  },


  {
    name: "New York Avenue",
    price: 200,
    rent: 16,
    rent1House: 80,
    rent2Houses: 220,
    rent3Houses: 600,
    rent4Houses: 800,
    rentHotel: 1000,
  },
  {
    name: "Kentucky Avenue",
    price: 220,
    rent: 18,
    rent1House: 90,
    rent2Houses: 250,
    rent3Houses: 700,
    rent4Houses: 875,
    rentHotel: 1050,
  },


  {
    name: "Indiana Avenue",
    price: 220,
    rent: 18,
    rent1House: 90,
    rent2Houses: 250,
    rent3Houses: 700,
    rent4Houses: 875,
    rentHotel: 1050,
  },
  {
    name: "Illinois Avenue",
    price: 240,
    rent: 20,
    rent1House: 100,
    rent2Houses: 300,
    rent3Houses: 750,
    rent4Houses: 925,
    rentHotel: 1100,
  },
  {
    name: "Atlantic Avenue",
    price: 260,
    rent: 22,
    rent1House: 110,
    rent2Houses: 330,
    rent3Houses: 800,
    rent4Houses: 975,
    rentHotel: 1150,
  },
  {
    name: "Ventnor Avenue",
    price: 260,
    rent: 22,
    rent1House: 110,
    rent2Houses: 330,
    rent3Houses: 800,
    rent4Houses: 975,
    rentHotel: 1150,
  },
  {
    name: "Marvin Gardens",
    price: 280,
    rent: 24,
    rent1House: 120,
    rent2Houses: 360,
    rent3Houses: 850,
    rent4Houses: 1025,
    rentHotel: 1200,
  },
  {
    name: "Pacific Avenue",
    price: 300,
    rent: 26,
    rent1House: 130,
    rent2Houses: 390,
    rent3Houses: 900,
    rent4Houses: 1100,
    rentHotel: 1275,
  },
  {
    name: "North Carolina Avenue",
    price: 300,
    rent: 26,
    rent1House: 130,
    rent2Houses: 390,
    rent3Houses: 900,
    rent4Houses: 1100,
    rentHotel: 1275,
  },
  {
    name: "Pennsylvania Avenue",
    price: 320,
    rent: 28,
    rent1House: 150,
    rent2Houses: 450,
    rent3Houses: 1000,
    rent4Houses: 1200,
    rentHotel: 1400,
  },
  {
    name: "Park Place",
    price: 350,
    rent: 35,
    rent1House: 175,
    rent2Houses: 500,
    rent3Houses: 1100,
    rent4Houses: 1300,
    rentHotel: 1500,
  },
  {
    name: "Boardwalk",
    price: 400,
    rent: 50,
    rent1House: 200,
    rent2Houses: 600,
    rent3Houses: 1400,
    rent4Houses: 1700,
    rentHotel: 2000,
  },
];
```




# Simplified Rent Calculation

```js
function calcRentWithHouses(baseRent, houses) {
  switch (houses) {
    case 1:
      return baseRent * 5;
    case 2:
      return baseRent * 15;
    case 3:
      return baseRent * 35;
    case 4:
      return baseRent * 50;
    case 5: // hotel
      return baseRent * 80;
    default:
      return baseRent; // no houses
  }
}
```
