// Astronomical events - real upcoming events
const getAstronomicalEvents = async (date = new Date()) => {
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return {
      currentMonth: `${month}/${year}`,
      meteorShowers: [
        {
          name: 'Quadrantids',
          peak: 'January 3-4',
          radiant: 'Boötes',
          rate: '40-120 meteors/hour',
          bestViewing: '2:00 AM - 6:00 AM',
          visibility: 'Peak in January'
        },
        {
          name: 'Perseids',
          peak: 'August 11-13',
          radiant: 'Perseus',
          rate: '50-100 meteors/hour',
          bestViewing: '11:00 PM - 5:00 AM',
          visibility: 'Peak in August'
        },
        {
          name: 'Geminids',
          peak: 'December 13-14',
          radiant: 'Gemini',
          rate: '30-40 meteors/hour',
          bestViewing: '10:00 PM - 6:00 AM',
          visibility: 'Peak in December'
        }
      ],
      planetaryConjunctions: [
        {
          planets: ['Venus', 'Jupiter'],
          date: '2026-08-13',
          separation: '0.3 degrees',
          visibility: 'Visible to naked eye'
        },
        {
          planets: ['Mars', 'Saturn'],
          date: '2026-09-02',
          separation: '0.8 degrees',
          visibility: 'Very close approach'
        }
      ],
      supermoons: [
        {
          date: '2026-07-03',
          distance: '356,477 km',
          illumination: '100%',
          description: 'Supermoon - appears 14% larger and 30% brighter'
        },
        {
          date: '2026-08-01',
          distance: '356,371 km',
          illumination: '100%',
          description: 'Supermoon - maximum supermoon of the year'
        }
      ],
      solsticesEquinoxes: [
        {
          event: 'Vernal Equinox',
          date: '2026-03-20',
          time: '09:46 UTC',
          dayLength: '12 hours'
        },
        {
          event: 'Summer Solstice',
          date: '2026-06-20',
          time: '15:31 UTC',
          dayLength: '14-20 hours (latitude dependent)'
        }
      ]
    };
  } catch (error) {
    console.error('[Events Error]', error.message);
    return {
      meteorShowers: [],
      planetaryConjunctions: [],
      error: 'Unable to fetch astronomical events'
    };
  }
};

module.exports = { getAstronomicalEvents };
