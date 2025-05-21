const fs = require('fs');
const file = 'src/concert/dto/create-concert.dto.ts';
const content = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, content.replace(/\r\n/g, '\n')); 