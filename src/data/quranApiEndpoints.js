const endpointCards = [
  {
    title: '1. Get All Surahs',
    endpoint: 'GET /surah',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /surah',
    sampleResponse: `[
  {
    "number": 1,
    "name": "الفاتحة",
    "englishName": "Al-Fatiha",
    "englishNameTranslation": "The Opening",
    "numberOfAyahs": 7,
    "revelationType": "Meccan"
  },
  {
    "number": 2,
    "name": "البقرة",
    "englishName": "Al-Baqarah",
    "englishNameTranslation": "The Cow",
    "numberOfAyahs": 286,
    "revelationType": "Medinan"
  },
  ...
]`,
  },
  {
    title: '2. Get Surah by Number',
    endpoint: 'GET /surah/:surahNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /surah/1',
    sampleResponse: `{
  "number": 1,
  "name": "الفاتحة",
  "englishName": "Al-Fatiha",
  "englishNameTranslation": "The Opening",
  "numberOfAyahs": 7,
  "revelationType": "Meccan"
}`,
  },
  {
    title: '3. Get Ayah by Surah Number and Verse Number',
    endpoint: 'GET /surahNumber:verseNumber&lang=eng',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /1:1',
    sampleResponse: `
    for english language (eng) :
    {
  "number": 1,
  "text": "In the name of Allah, the Most Gracious, the Most Merciful."
},
  for arabic language (arabic) :{
    "number": 1,
  "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
}
  for urdu language (urdu) :{
   "number": 1,
  "text": "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے"
  }`,
  },
  {
    title: '4. Get Audio',
    endpoint: 'GET /audio/:reciter/surahNumber:verseNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /audio/Alafasy_64kbps/1:1',
    sampleResponse: `Audio file (MP3 format)`,
  },
  {
    title: '5. Get Reciters',
    endpoint: 'GET /reciters',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /reciters',
    sampleResponse: `[
  {
    "name": "Alafasy",
    "subfolder": "Alafasy_64kbps"
  },
  {
    "name": "Minshawy Murattal",
    "subfolder": "Minshawy_Murattal_128kbps"
  },
  ...
]`,
  },
  {
    title: '6. Get Para Images',
    endpoint: 'GET /para/paraNumber:pageNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /para/1:5',
    sampleResponse: `Image file (PNG format)`,
  },
  {
    title: '7. Get Surah Images',
    endpoint: 'GET /surah/surahNumber:pageNumber',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /surah/2:30',
    sampleResponse: `Image file (PNG format)`,
  },
  {
    title: '8. Get All Verses in JSON Format',
    endpoint: 'GET /',
    headers: 'x-api-key : YOUR_API_KEY',
    exampleRequest: 'GET /',
    sampleResponse: `Complete Quran JSON structure with all verses`,
  },
];