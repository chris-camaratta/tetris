export function randomInt(max) {
  const buf = new Uint32Array(1);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues)
    crypto.getRandomValues(buf);
  else
    buf[0] = Math.floor(Math.random() * 0xffffffff);
  return Math.floor((buf[0] / (0xffffffff + 1)) * max);
}

export default { randomInt };
