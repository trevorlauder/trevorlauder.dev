// This script will update all Font Awesome @font-face rules in fontawesome.css to use font-display: swap instead of block.
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../assets/css/fontawesome.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/font-display:block/g, 'font-display:swap');

fs.writeFileSync(cssPath, css);
console.log('font-display updated to swap in fontawesome.css');
