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
}
