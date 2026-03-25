const lastSelectedSources = new Map();
const FEEDS_PER_CYCLE = 4;

function shuffleList(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function randomFeed(group) {
  const index = Math.floor(Math.random() * group.length);
  return group[index];
}

function rotateFeed(group, category) {
  const lastSource = lastSelectedSources.get(category);
  const eligibleFeeds = group.filter((feed) => feed.name !== lastSource);
  const selectionPool = eligibleFeeds.length > 0 ? eligibleFeeds : group;
  const selectedFeed = randomFeed(selectionPool);

  lastSelectedSources.set(category, selectedFeed.name);

  return selectedFeed;
}

function selectFeedsForCycle(feeds) {
  const groupedFeeds = [
    { ...rotateFeed(feeds.indianPolitics, "indianPolitics"), category: "indianPolitics" },
    { ...rotateFeed(feeds.indianEconomy, "indianEconomy"), category: "indianEconomy" },
    { ...rotateFeed(feeds.indianSports, "indianSports"), category: "indianSports" },
    { ...rotateFeed(feeds.worldPolitics, "worldPolitics"), category: "worldPolitics" },
    { ...rotateFeed(feeds.worldEconomy, "worldEconomy"), category: "worldEconomy" },
    { ...rotateFeed(feeds.worldSports, "worldSports"), category: "worldSports" },
  ];

  return shuffleList(groupedFeeds).slice(0, FEEDS_PER_CYCLE);
}

module.exports = { FEEDS_PER_CYCLE, randomFeed, selectFeedsForCycle };
