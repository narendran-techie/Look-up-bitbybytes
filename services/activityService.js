const ACTIVITY_MESSAGES = [
  'ISS Position Updated',
  'Satellite Entered Orbit',
  'Orbital Scan Completed',
  'Solar Activity Rising',
  'Asteroid Trajectory Updated',
  'Communication Relay Confirmed',
  'Flight Path Refined',
  'Status Beacon Verified'
];

const buildTime = (minutesAgo) => {
  const date = new Date(Date.now() - minutesAgo * 60000);
  return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')} UTC`;
};

const fetchActivityFeed = async () => {
  const count = 8;
  return Array.from({ length: count }).map((_, index) => ({
    time: buildTime(index * 2 + 1),
    message: ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)]
  }));
};

module.exports = { fetchActivityFeed };
