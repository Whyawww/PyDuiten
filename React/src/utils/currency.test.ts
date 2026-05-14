import { describe, it, expect } from "vitest";
import { formatRp } from "./currency";

describe("Fungsi Utility: formatRp", () => {
  it("harus nambahin awalan Rp dan titik pemisah ribuan dengan bener", () => {
    const hasil = formatRp(1500000);

    expect(hasil).toMatch(/Rp\s*1\.500\.000/);
  });

  it("harus bisa nanganin angka 0 (saldo kosong)", () => {
    expect(formatRp(0)).toMatch(/Rp\s*0/);
  });

  it("harus kebal dan aman kalau nerima tipe data string dari API", () => {
    const hasil = formatRp("50000");
    expect(hasil).toMatch(/Rp\s*50\.000/);
  });
});
