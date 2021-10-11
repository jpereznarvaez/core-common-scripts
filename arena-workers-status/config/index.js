const {
  ARENA_UI_URL,
  ARENA_API_URL,
  ARENA_USERNAME,
  ARENA_PASSWORD,
  ENABLE_ARENA_AUTH
} = process.env;

module.exports = {
  arenaUiUrl: ARENA_UI_URL,
  arenaApiUrl: ARENA_API_URL,
  enableArenaAuth: JSON.parse(ENABLE_ARENA_AUTH),
  arenaAuth: {
    username: ARENA_USERNAME,
    password: ARENA_PASSWORD
  }
};
