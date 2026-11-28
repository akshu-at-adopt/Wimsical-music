// Mixtape for S.
//
// To add a song: find it on YouTube and paste the video ID into `youtube`
// (the part after "watch?v=" in the link, e.g. youtube.com/watch?v=F1M2iy1xKlo -> "F1M2iy1xKlo").
// Official audio uploads ("Topic" channels on YouTube Music) start straight with the music.
// If a video has an intro, set `start` to the second where the song begins.
// That's what plays on the site. `spotify` is optional: it powers the "Open in Spotify" button.
// To show your own words on the orange screen, fill `words` with pairs,
// e.g. words: [["first", "word"], ["next", "pair"]]. Leave it empty to show the title.
// `check: true` marks songs where the title, film or link still needs confirming.

export type Song = {
  title: string;
  from: string;
  spotify: string;
  youtube: string;
  start?: number; // seconds to skip at the beginning (e.g. a label intro)
  words: [string, string][];
  check?: boolean;
};

export type Mood = {
  id: string;
  name: string;
  bg: string;
  songs: Song[];
};

// The whole mixtape as one Spotify playlist (shown under the song list and in the ☰ menu).
export const PLAYLIST_URL = "https://open.spotify.com/playlist/1oz6z8XsgZP2mWkYuVr17X";

export const MOODS: Mood[] = [
  {
    id: "happy", name: "Happy", bg: "#0d4a4c",
    songs: [
      { title: "Ambarsariya", from: "Fukrey, 2013", spotify: "https://open.spotify.com/track/4qRcjFkFqSpLBzcbLDt7HL", youtube: "fbx6ULRrhXg", words: [] },
      { title: "Manchala", from: "Hasee Toh Phasee, 2014", spotify: "https://open.spotify.com/track/1XoOFe3xEGvNVYzKEKQkG6", youtube: "TNqmyUJAf_E", words: [] },
      { title: "Khabar Nahi", from: "Dostana, 2008", spotify: "https://open.spotify.com/track/5xfQ2oiCwTGuR69rYxLrFe", youtube: "vjtNRCUYMG0", words: [] },
      { title: "Slow Motion Angreza", from: "Bhaag Milkha Bhaag, 2013", spotify: "https://open.spotify.com/track/0JX7Es2j556FwtR6YqMKzP", youtube: "IV-AZaDKJ5o", words: [] },
      { title: "Madari", from: "Coke Studio India", spotify: "https://open.spotify.com/track/5Xqh943S5SxMVFyspMGQoA", youtube: "OOlhqEn5XAQ", words: [] },
      { title: "Hoshiyar Rehna", from: "Kabir Cafe", spotify: "https://open.spotify.com/track/0fW9BxQW9dqTcJEdNyO08E", youtube: "nzSuR9AVMDs", words: [] },
      { title: "Halke Gaadi Hako", from: "Kabir Cafe", spotify: "https://open.spotify.com/track/3hkVHUC4KjWXt50mBxEKHo", youtube: "MxUgE6Pz9_Q", words: [] },
      { title: "Mann Lagyo Mero Yaar Fakiri Mein", from: "Kabir Cafe", spotify: "https://open.spotify.com/track/0N690kRoPbKTAnehGM6plV", youtube: "2f80nd1kqTo", words: [["mann lagyo", "fakiri mein"]] },
      { title: "Mat Kar Maya Ko Ahankar", from: "Kabir Cafe", spotify: "https://open.spotify.com/track/18dts4OqWOQTGFlMTGodkk", youtube: "V_08pyhaaTo", words: [] },
    ],
  },
  {
    id: "in-love", name: "In love", bg: "#7a1446",
    songs: [
      { title: "Afreen Afreen", from: "Coke Studio Pakistan", spotify: "https://open.spotify.com/track/6hTchL2DHhANaQuTLD2LL7", youtube: "SMlGGRAB3Hc", words: [] },
      { title: "Jeev Rangla", from: "Jogwa, 2009", spotify: "https://open.spotify.com/track/5ILj64D0dUZjh5QWx0FfMT", youtube: "gtDPLOVPjkA", words: [] },
      { title: "O Rangrez", from: "Bhaag Milkha Bhaag, 2013", spotify: "https://open.spotify.com/track/5JCDVLwteSXuwVqjCa7SwH", youtube: "aYnrl1c1_U0", words: [] },
      { title: "Yeh Tune Kya Kiya", from: "Once Upon a Time in Mumbai Dobaara, 2013", spotify: "https://open.spotify.com/track/2cPUB8EOT6AfJ8oxhyoNXL", youtube: "jcAn44985E0", words: [] },
      { title: "Rangrez", from: "Tanu Weds Manu, 2011 · Krsna", spotify: "https://open.spotify.com/track/0G6AAaSdzlqO9gqNNpMM2z", youtube: "q8IrpdcXHUE", words: [] },
      { title: "Yun Hi", from: "Tanu Weds Manu, 2011", spotify: "https://open.spotify.com/track/6z5zRQHFEEBrvMkVjjCN8S", youtube: "Rjpl5Z0Jq1c", words: [] },
      { title: "Saibo", from: "Shor in the City, 2011", spotify: "https://open.spotify.com/track/6udC4b4jOSnHb9ItnXgKLR", youtube: "JeiZTnRfrbM", words: [] },
      { title: "Mast Magan", from: "2 States, 2014", spotify: "https://open.spotify.com/track/3uL1IBFhg52VcQqOwAG01E", youtube: "SDQdGibJ9mE", words: [] },
      { title: "Sawaar Loon", from: "Lootera, 2013", spotify: "https://open.spotify.com/track/29YePgOxuPLfU7uZKxKf6w", youtube: "GpLj8f2CI00", words: [] },
      { title: "Guzarish", from: "Ghajini, 2008", spotify: "https://open.spotify.com/track/6bg7mRA6JN52D5Nyzba0h2", youtube: "cK9h5PVzRpk", words: [] },
      { title: "Aaj Ibaadat", from: "Bajirao Mastani, 2015", spotify: "https://open.spotify.com/track/5UlAGdosCX86KR0j9ykfMa", youtube: "Jq_kT_tTco0", words: [] },
      { title: "Chakora", from: "Mirzya, 2016", spotify: "https://open.spotify.com/track/6sZKeJSrOQkq6rWYBhN8ti", youtube: "2-iUwjpfyQk", words: [] },
      { title: "Hota Hai", from: "Mirzya, 2016", spotify: "https://open.spotify.com/track/3gfOxBLid2ZGarJhlcqAyb", youtube: "Ek4gYWP4cdA", words: [] },
    ],
  },
  {
    id: "missing-you", name: "Missing you", bg: "#1b2152",
    songs: [
      { title: "Tere Bina", from: "Guru, 2007", spotify: "https://open.spotify.com/track/4FeczSomVWVyU4FW7xDeAI", youtube: "Fi3GovijpWA", words: [] },
      { title: "Mitwa", from: "Kabhi Alvida Naa Kehna, 2006", spotify: "https://open.spotify.com/track/0Z5iDLhKIocyLiNwzLdmRc", youtube: "AsieVqOTRs0", words: [] },
      { title: "O Re Piya", from: "Aaja Nachle, 2007", spotify: "https://open.spotify.com/track/7ri1gCGoYuEgutMLZuZ8pY", youtube: "yyYpmJx8zuU", words: [] },
      { title: "Tune Jo Na Kaha", from: "New York, 2009", spotify: "https://open.spotify.com/track/0pw3p4gf5homOkvOGOJulF", youtube: "01HR1uP4kic", words: [] },
      { title: "Phir Le Aaya Dil", from: "Barfi!, 2012", spotify: "https://open.spotify.com/track/1JuLr2B575N4kfcrDScDae", youtube: "XT_ANSoov00", words: [] },
      { title: "Jiya Lage Na", from: "Talaash, 2012", spotify: "https://open.spotify.com/track/5AhxzlhZbKYfu4YNiUnmvx", youtube: "rig5Et6jVLc", words: [] },
      { title: "Ek Nadi Thi", from: "Mirzya, 2016", spotify: "https://open.spotify.com/track/3V39HElcLcQYQw4WpNyKlw", youtube: "XTw03k1YXuM", words: [] },
      { title: "Kase Sartil Saye", from: "Sandeep Khare", spotify: "https://open.spotify.com/track/3f51SfC9dCByJmJYo4lAPj", youtube: "9evxok2G6OU", words: [] },
      { title: "Bhare Naina", from: "Ra.One, 2011", spotify: "https://open.spotify.com/track/2UsYQNgpG5tjcDoq8Yg0Nl", youtube: "QSovkFvJW6k", words: [] },
      { title: "Bawra Mann", from: "Hazaaron Khwaishein Aisi, 2005", spotify: "https://open.spotify.com/track/6v6MAvQpRUS0dRPZQiMHPv", youtube: "qzdiFlT9vAs", words: [] },
      { title: "Monta Re", from: "Lootera, 2013", spotify: "https://open.spotify.com/track/5UHvVfewZKxwoB6gdhSFtr", youtube: "ZikBTLDBmm4", words: [] },
      { title: "Lat Uljhi Suljha Ja Balam", from: "Ankita Joshi · classical", spotify: "", youtube: "8Z-6C9G0spE", words: [["lat uljhi", "suljha ja balam"]] },
      { title: "Aaja Balam Pardesi", from: "", spotify: "", youtube: "", words: [], check: true },
    ],
  },
  {
    id: "as-favourite", name: "A’s favourite", bg: "#6b3608",
    songs: [
      { title: "Lallati Bhandar", from: "Jogwa, 2009", spotify: "https://open.spotify.com/track/0kt9xGWGomC6OGFXkwLY5k", youtube: "BoUoZwNnQQE", words: [] },
      { title: "Natrang Ubha", from: "Natarang, 2010", spotify: "https://open.spotify.com/track/5sXzkoVogD5QdCtj3vtUmm", youtube: "BIqhyCB7LH4", words: [] },
      { title: "Mann Mandira", from: "Katyar Kaljat Ghusli, 2015", spotify: "https://open.spotify.com/track/6k0yY6ZBndjwgULEr43RwP", youtube: "2CbqcI_9-9Y", words: [] },
      { title: "Apsara Aali", from: "Natarang, 2010", spotify: "https://open.spotify.com/track/7uWt6BU9XnA6izKKjHtMwG", youtube: "OQ5VvS0GBaY", words: [] },
      { title: "Prabhat Geet", from: "Marathi", spotify: "", youtube: "", words: [], check: true },
      { title: "Soni Gokula Cha Paani", from: "Marathi", spotify: "", youtube: "", words: [], check: true },
    ],
  },
  {
    id: "bar-nights", name: "Bar nights", bg: "#5a0a17",
    songs: [
      { title: "Khoya Khoya Chand", from: "The Bartender mix, 2011", spotify: "https://open.spotify.com/track/4GtXjMD1s7hxOcZpaILtdv", youtube: "F1M2iy1xKlo", start: 5, words: [] },
      { title: "Fifi", from: "Bombay Velvet, 2015", spotify: "https://open.spotify.com/track/1f7l6tzcBAU9CPvYBBBdBS", youtube: "ZH8b-SUi23A", words: [] },
      { title: "Yeh Mera Deewanapan Hai", from: "Yahudi, 1958", spotify: "https://open.spotify.com/track/2Be3pDNefXaZKlxqxt3fQp", youtube: "bVrh07enaIo", words: [] },
      { title: "Aaiye Meherbaan", from: "Howrah Bridge, 1958", spotify: "https://open.spotify.com/track/5vvkKkLRXcCvcRK40ld4df", youtube: "qaAhBIY3wsQ", words: [] },
      { title: "Ghodey Pe Sawaar", from: "Qala, 2022", spotify: "https://open.spotify.com/track/1a8w8nlIyIhE2W1HIayKnl", youtube: "cY4FmcWT0Rc", words: [] },
      { title: "Shauq", from: "Qala, 2022", spotify: "https://open.spotify.com/track/2I0MIQhICYnKHvaxUHYH49", youtube: "vnt65_GElMU", words: [] },
      { title: "Bismil", from: "Haider, 2014", spotify: "https://open.spotify.com/track/1djNPKQ1gC7FQXjV3z9UPM", youtube: "50q8wD6MXgI", words: [] },
    ],
  },
  {
    id: "qawwali", name: "Qawwali", bg: "#3b1f4a",
    songs: [
      { title: "Un Ka Andaz-e-Karam", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/2nw2P0obATD8LaLR53X6l1", youtube: "onqo9TNFkiY", words: [] },
      { title: "Tumhe Dillagi Bhool Jani Padegi", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/3YG634lejEuYl1l6PYC92r", youtube: "X0aWquXGXXU", words: [["tumhe dillagi", "bhool jani padegi"]] },
      { title: "Dil Pe Zakhm Khate Hain", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/0BH8BBD8DKy5rOZmv5bnFH", youtube: "SW1dcQJE3-g", words: [] },
      { title: "Saanson Ki Mala Pe", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/26xZme8zLXUCydcUP3ZDF7", youtube: "LBs6L3Xafpg", words: [] },
      { title: "Sochta Hoon Ke Woh Kitne Masoom The", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/3N7O4IxjPtX8qQTMsjFwy5", youtube: "0bxfIRONPc4", words: [["sochta hoon", "kitne masoom the"]] },
      { title: "Aankh Uthi Mohabbat Ne Angdai Li", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/7I3h91usQm1ftb4wv2Jz8X", youtube: "d6Cl0mY8EoQ", words: [["aankh uthi", "mohabbat ne"]] },
      { title: "Kali Kali Zulfon Ke Phande Na Dalo", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/0FTfaxNtqgYbqPPcrWQ1IS", youtube: "bECbyyTjM44", words: [["kali kali zulfon", "phande na dalo"]] },
      { title: "Yeh Jo Halka Halka Suroor Hai", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/2zxcI0eCGCXBScFci7WpPG", youtube: "G8wCaZ2Kok8", words: [["halka halka", "suroor hai"]] },
      { title: "Mast Nazron Se Allah Bachaye", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/1Ix5hQLZLZpAvnghM8QDE8", youtube: "0ffZWT00p2c", words: [] },
      { title: "Akhiyan Udeek Diyan", from: "Nusrat Fateh Ali Khan", spotify: "https://open.spotify.com/track/2YCLVjBOmEERncaJzcM8EE", youtube: "fFjbAyFIZ6Q", words: [] },
    ],
  },
];
