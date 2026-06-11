import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "www", "icons");
mkdirSync(outDir, { recursive: true });

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(size) {
  const bg = [13, 16, 22];
  const accent = [168, 144, 96];
  const text = [200, 205, 216];
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;

  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1) + 1;
    raw[row - 1] = 0;
    for (let x = 0; x < size; x++) {
      const i = row + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist <= radius) {
        raw[i] = accent[0];
        raw[i + 1] = accent[1];
        raw[i + 2] = accent[2];
        raw[i + 3] = 255;
      } else if (Math.abs(dx) < size * 0.12 && Math.abs(dy) < size * 0.08) {
        raw[i] = text[0];
        raw[i + 1] = text[1];
        raw[i + 2] = text[2];
        raw[i + 3] = 255;
      } else {
        raw[i] = bg[0];
        raw[i + 1] = bg[1];
        raw[i + 2] = bg[2];
        raw[i + 3] = 255;
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

for (const size of [180, 192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), makePng(size));
}

console.log("Icons generated in www/icons/");
