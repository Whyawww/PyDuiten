import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateFinancialAdvice(
    income: number,
    expense: number,
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash',
    });

    const prompt = `
      Kamu adalah asisten keuangan pribadi Gen Z. Bicaralah dengan gaya tongkrongan santai (menggunakan kata cuy, bro, lu, gua).
      
      Berikut adalah data keuangan user bulan ini:
      - Pemasukan: Rp ${income}
      - Pengeluaran: Rp ${expense}

      Aturan membalas:
      1. Jika pengeluaran lebih besar dari pemasukan, roasting dengan keras dan pastikan ada kalimat "Buset cuy kata gua mah lu mending tobat dah, mark zuckerberg sungkem ini mah".
      2. Jika pengeluaran hampir mendekati pemasukan (sisa sedikit), tegur dengan santai menggunakan kalimat "Buset lumayan boros ya cuy, cari cuan lagi cuy atau lebih hemat lah".
      3. Jika pemasukan jauh lebih besar dari pengeluaran (sisa banyak), puji dengan kalimat "Gilaaa cuy jago bet nyari duitnya, jangan lupa investasi".

      Berikan respons maksimal 2 atau 3 kalimat saja. Langsung ke intinya tanpa basa-basi pembuka.
    `;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI Error:', error);
      return 'Waduh cuy, AI gua lagi pusing mikirin duit lu. Coba refresh lagi ya...';
    }
  }

  async generateSmartNudge(income: number, expense: number): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash',
    });

    const sisa = income - expense;
    const rasioSisa = income > 0 ? (sisa / income) * 100 : 0;

    const prompt = `
      Kamu adalah Smart Nudge untuk Gen Z. Bicaralah dengan gaya edukatif tapi santai (cuy, bro, lu, gua) maksimal 2 kalimat.
      Berdasarkan riset perencana keuangan 50/30/20, investasi/tabungan ideal adalah minimal 20% dari pemasukan.

      Data user:
      - Pemasukan: Rp ${income}
      - Pengeluaran: Rp ${expense}
      - Sisa Uang: Rp ${sisa} (Rasio sisa: ${rasioSisa.toFixed(1)}%)

      Aturan Nudge:
      1. Jika Sisa Uang kurang dari 10%: Ingatkan untuk fokus mengerem pengeluaran tidak penting (bocor halus) dan utamakan membangun Dana Darurat terlebih dahulu.
      2. Jika Sisa Uang antara 10% - 20%: Apresiasi karena sudah bisa menyisihkan uang, lalu dorong agar lebih konsisten menabung untuk masa depan.
      3. Jika Sisa Uang di atas 20%: Ingatkan bahwa sisa uangnya sangat ideal. Sarankan untuk melakukan diversifikasi investasi jangka panjang secara rutin yang proporsional dengan besaran pemasukannya.

      PENTING: Jangan pernah menyebutkan angka nominal pasti (misal: 100 ribu), nama produk, merek, instrumen, atau platform investasi spesifik (seperti nama bank, saham, kripto, atau aplikasi). Berikan saran secara umum dan konseptual saja.

      Berikan 1 pesan singkat yang memotivasi tanpa awalan salam.
    `;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI Smart Nudge Error:', error);
      return 'Sisihkan dikit buat dana darurat ya cuy, jaga-jaga buat masa depan!';
    }
  }

  async generateCategoryAnalysis(categorySummary: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash',
    });

    const prompt = `
      Kamu adalah Data Analyst Keuangan Gen Z. Bicaralah dengan gaya asik, tajam, dan santai (cuy, bro, lu, gua).
      Berikut adalah rekap total transaksi user per kategori bulan ini (Format: JSON):
      ${categorySummary}

      Buatlah catatan ringkasan analisis yang terbagi menjadi 3 paragraf singkat:
      1. Pemasukan yang ngebantu banget (apresiasi sumber cuannya).
      2. Pengeluaran yang masih wajar/normal (seperti tagihan, makan standar).
      3. Pengeluaran yang lumayan boros atau bikin boncos banget (roasting kategori yang makan porsi paling gede).

      Aturan:
      - Gunakan format HTML list (<ul><li>...</li></ul>) agar rapi saat dirender di frontend.
      - Jangan gunakan awalan/akhiran markdown seperti \`\`\`html. Langsung berikan tag HTML-nya.
      - Jika data kosong atau sangat sedikit, berikan respons: "Belum banyak data nih cuy, catat transaksi lu dulu biar gua bisa kasih analisis!"
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.replace(/```html|```/g, '').trim();
    } catch (error) {
      console.error('AI Category Analysis Error:', error);
      return '<p>Waduh cuy, AI gua lagi pusing nganalisis kategori lu. Coba bentar lagi ya.</p>';
    }
  }
}
