const stock = {
  bottle: '229',
  socks: '342',
  shirt: {
    small: '45',
    medium: '0',
    large: '21',
    xlarge: '19',
  },
};

const customers = [
  {
    givenName: 'Rick',
    surname: 'Sanchez',
    email: 'rick@sanchez.com',
    address: '123 Main Street',
    city: 'Montreal',
    province: 'Quebec',
    postcode: 'H8H 1H1',
    country: 'Canada',
  },
  {
    givenName: 'John',
    surname: 'Doe',
    email: 'some@amnesia.net',
    address: '',
    city: 'Vancouver',
    province: 'British Columbia',
    postcode: 'M5C 2E4',
    country: 'Canada',
  },
];

module.exports = { stock, customers };
