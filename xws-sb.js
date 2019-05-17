const { pilots: pilotFiles } = require("./xwing-data2/data/manifest.json");

const loadedData = {};

const mapSlotXWSToName = {
  astromech: "Astromech",
  cannon: "Cannon",
  configuration: "Configuration",
  crew: "Crew",
  device: "Device",
  "force-power": "Force Power",
  gunner: "Gunner",
  illicit: "Illicit",
  missile: "Missile",
  modification: "Modification",
  sensor: "Sensor",
  tacticalrelay: "Tactical Relay",
  talent: "Talent",
  tech: "Tech",
  title: "Title",
  torpedo: "Torpedo",
  turret: "Turret"
};

const loadPilotsAndShips = () => {
  const allPilots = [];
  const allShips = [];

  manifest.pilots.forEach(({ ships }) => {
    ships.forEach(filename => {
      const { pilots = [], ship } = require(`./xwing-data2/${filename}`);
      allPilots.push(...pilots);
      allShips.push(ship);
    });
  });

  return { ships: allShips, pilots: allPilots };
};

const getPilots = () => {
  if (!loadedData.pilots) {
    const { pilots } = loadPilotsAndShips();
    loadedData.pilots = pilots;
  }
  return loadedData.pilots;
};

const getPilotXWSIds = () => {
  const pilots = getPilots();
  return pilots.map(p => p.xws).filter(Boolean);
};

const validatePilotXWSId = id => {
  const ids = getPilotXWSIds();
  if (ids.indexOf(id) === -1) {
    throw new Error(`Pilot xws id "${id}" does not exist`);
  }
};

const loadUpgrades = () => {
  const allUpgrades = [];

  manifest.upgrades.forEach(filename => {
    const upgrades = require(`./xwing-data2/${filename}`);
    allUpgrades.push(...upgrades);
  });

  return { upgrades: allUpgrades };
};

const getUpgrades = () => {
  if (!loadedData.upgrades) {
    const { upgrades } = loadUpgrades();
    loadedData.upgrades = upgrades;
  }
  return loadedData.upgrades;
};

const getUpgradesXWSIds = () => {
  const upgrades = getUpgrades();
  return upgrades.map(u => u.xws).filter(Boolean);
};

const getUpgradesXWSIdsForSlot = slotName => {
  const slotId = mapSlotXWSToName[slotName] || slotName;
  const upgrades = getUpgrades();
  return upgrades
    .filter(u => u.sides.some(s => s.type === slotId))
    .map(u => u.xws)
    .filter(Boolean);
};

const validateUpgradeXWSIdForSlot = (id, slotName) => {
  const ids = getUpgradesXWSIdsForSlot(slotName);
  if (ids.indexOf(id) === -1) {
    throw new Error(
      `Upgrade xws id "${id}" does not exist for slot "${slotName}"`
    );
  }
};

module.exports = {
  getPilotXWSIds,
  validatePilotXWSId,
  getUpgradesXWSIds,
  validateUpgradeXWSIdForSlot
};

