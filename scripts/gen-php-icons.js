// Menghasilkan php/app/lib/icons.php dari src/icons.js (sumber tunggal ikon).
const fs = require('fs');
const path = require('path');
const { icon, names } = require('../src/icons');

let php = "<?php\ndeclare(strict_types=1);\n\n/** Ikon garis 24x24 inline (SVG). Dihasilkan dari scripts/gen-php-icons.js. */\nfunction icon(string $name, int $size = 20, string $cls = ''): string\n{\n    static $P = [\n";
const body = (n) => icon(n, 24).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
for (const n of names) php += `        '${n}' => '${body(n).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',\n`;
const wa = body('whatsapp').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
php += `    ];\n    $wa = '${wa}';\n    $isWa = $name === 'whatsapp';\n    $b = $isWa ? $wa : ($P[$name] ?? $P['globe']);\n`;
php += `    $attrs = $isWa ? '' : ' fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';\n`;
php += `    return '<svg class="ico ' . $cls . '" width="' . $size . '" height="' . $size . '" viewBox="0 0 24 24"' . $attrs . ' aria-hidden="true" focusable="false">' . $b . '</svg>';\n}\n`;
fs.writeFileSync(path.join(__dirname, '..', 'php', 'app', 'lib', 'icons.php'), php);
console.log(names.length + 1, 'ikon ditulis');
