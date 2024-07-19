// require('dotenv').config({ path: '../.env' });
// const axios = require('axios');

// const transcribeRealTime = async (req, res) => {
//   const audioData = req.file.buffer.toString('base64'); 

//   try {
//     const response = await axios.post(
//       'https://api.assemblyai.com/v2/stream',
//       { audio_data: audioData },
//       {
//         headers: {
//           'authorization': process.env.ASSEMBLYAI_API_KEY,
//           'content-type': 'application/json',
//         },
//         params: {
//           language_code: 'ru'
//         }
//       }
//     );

//     const transcription = response.data;
//     res.json({ transcription });
//   } catch (error) {
//     console.error('Ошибка при транскрипции аудио:', error);
//     res.status(500).json({ error: 'Ошибка при транскрипции аудио' });
//   }
// };

// module.exports = { transcribeRealTime };
