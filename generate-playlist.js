const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, 'audio');
const OUTPUT_FILE = path.join(__dirname, 'playlist.json');

function generatePlaylist() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log('پوشه audio وجود ندارد. ایجاد می‌شود...');
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  const files = fs.readdirSync(AUDIO_DIR)
    .filter(file => /\.(mp3|wav|ogg|m4a)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const playlist = files.map(fileName => {
    const stats = fs.statSync(path.join(AUDIO_DIR, fileName));
    const title = fileName.replace(/\.(mp3|wav|ogg|m4a)$/i, '');
    return {
      title: title,
      file: fileName,
      url: `audio/${fileName}`,
      size: stats.size,
      date: stats.mtime.toISOString().split('T')[0]
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(playlist, null, 2));
  console.log(`لیست پخش با ${playlist.length} فایل ساخته شد.`);
}

generatePlaylist();
