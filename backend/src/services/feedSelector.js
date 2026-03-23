const lastSelectedSources = new Map();

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
  return [
    { ...rotateFeed(feeds.indianPolitics, "indianPolitics"), category: "indianPolitics" },
    { ...rotateFeed(feeds.indianEconomy, "indianEconomy"), category: "indianEconomy" },
    { ...rotateFeed(feeds.indianSports, "indianSports"), category: "indianSports" },
    { ...rotateFeed(feeds.worldPolitics, "worldPolitics"), category: "worldPolitics" },
    { ...rotateFeed(feeds.worldEconomy, "worldEconomy"), category: "worldEconomy" },
    { ...rotateFeed(feeds.worldSports, "worldSports"), category: "worldSports" },
  ];
}

module.exports = { randomFeed, selectFeedsForCycle };
