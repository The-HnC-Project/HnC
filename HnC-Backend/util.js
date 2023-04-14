// Random generated 6 digit number
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
export function randomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}
const algorithm = "aes-256-ctr";

export function encrypt(readData, securitykey) {
  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, securitykey, iv);

  const encrypted = Buffer.concat([cipher.update(readData), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
  };
}

export function decrypt(hash, securitykey) {
  const decipher = createDecipheriv(
    algorithm,
    securitykey,
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.data, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

