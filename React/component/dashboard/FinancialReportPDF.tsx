import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logoIcon from '../../src/assets/icons.png';
import { useTranslation } from 'react-i18next';

const COLORS = {
    primary: '#e07a5f',
    income: '#10b981',
    expense: '#ef4444',
    textDark: '#111827',
    textMid: '#1f2937',
    textMuted: '#6b7280',
    bgLight: '#f9fafb',
    bgBlue: '#eff6ff',
    border: '#f3f4f6',
    borderBlue: '#bfdbfe',
    textBlue: '#1e40af',
    white: '#ffffff',
} as const;

const s = StyleSheet.create({
    page: { padding: 40, backgroundColor: COLORS.white, fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingBottom: 15 },
    logo: { width: 45, height: 45, marginRight: 15 },
    headerTextContainer: { flex: 1 },
    title: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: COLORS.textMid },
    subtitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.primary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    card: { backgroundColor: COLORS.bgLight, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
    cardBlue: { backgroundColor: COLORS.bgBlue, borderColor: COLORS.borderBlue },
    label: { fontSize: 10, color: COLORS.textMuted, marginBottom: 4 },
    value: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: COLORS.textDark },
    valueIncome: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: COLORS.income },
    valueExpense: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: COLORS.expense },
    tableHeader: { flexDirection: 'row', backgroundColor: COLORS.border, padding: 8, borderRadius: 4 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, padding: 8 },
    cellHead: { fontSize: 10, fontFamily: 'Helvetica-Bold', flex: 1 },
    cell: { fontSize: 10, flex: 1, color: COLORS.textMid },
    cellIncome: { fontSize: 10, flex: 1, color: COLORS.income },
    cellExpense: { fontSize: 10, flex: 1, color: COLORS.expense },
    noteText: { fontSize: 11, lineHeight: 1.6, color: COLORS.textBlue },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: COLORS.textMuted, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
});

export interface ReportTransaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    categoryName?: string | null;
    amount: number;
    date: Date | string;
}

export interface ReportData {
    userName: string;
    dateRange: string;
    summary: { saldo: number; pemasukan: number; pengeluaran: number };
    analysisNote: string;
    transactions: ReportTransaction[];
}

interface FinancialReportPDFProps {
    data: ReportData;
}
export const FinancialReportPDF = ({ data }: FinancialReportPDFProps) => {
    const { t } = useTranslation();

    const formatRp = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

    return (
        <Document>
            <Page size="A4" style={s.page}>

                <View style={s.header}>
                    <Image src={logoIcon} style={s.logo} />
                    <View style={s.headerTextContainer}>
                        <Text style={s.title}>{t('dashboard_pdf.doc_title')}</Text>
                        <Text style={s.subtitle}>
                            {t('dashboard_pdf.name', { name: data.userName, period: data.dateRange })}
                        </Text>
                    </View>
                </View>

                <View style={s.section}>
                    <Text style={s.sectionTitle}>{t('dashboard_pdf.summary')}</Text>
                    <View style={s.card}>
                        <View style={s.row}>
                            <View>
                                <Text style={s.label}>{t('dashboard_pdf.total_income')}</Text>
                                <Text style={s.valueIncome}>{formatRp(data.summary.pemasukan)}</Text>
                            </View>
                            <View>
                                <Text style={s.label}>{t('dashboard_pdf.total_expense')}</Text>
                                <Text style={s.valueExpense}>{formatRp(data.summary.pengeluaran)}</Text>
                            </View>
                            <View>
                                <Text style={s.label}>{t('dashboard_pdf.final_balance')}</Text>
                                <Text style={s.value}>{formatRp(data.summary.saldo)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={s.section}>
                    <Text style={s.sectionTitle}>{t('dashboard_pdf.analysis')}</Text>
                    <View style={[s.card, s.cardBlue]}>
                        <Text style={s.noteText}>{stripHtml(data.analysisNote)}</Text>
                    </View>
                </View>

                <View style={s.section}>
                    <Text style={s.sectionTitle}>{t('dashboard_pdf.details')}</Text>
                    <View style={s.tableHeader}>
                        <Text style={s.cellHead}>{t('dashboard_pdf.date')}</Text>
                        <Text style={s.cellHead}>{t('dashboard_pdf.category')}</Text>
                        <Text style={s.cellHead}>{t('dashboard_pdf.type')}</Text>
                        <Text style={s.cellHead}>{t('dashboard_pdf.amount')}</Text>
                    </View>
                    {data.transactions.slice(0, 15).map((trx) => (
                        <View key={trx.id} style={s.tableRow}>
                            <Text style={s.cell}>
                                {new Date(trx.date).toLocaleDateString('id-ID')}
                            </Text>
                            <Text style={s.cell}>{t(`categories.${trx.categoryName || 'Lainnya'}`, trx.categoryName || 'Lainnya')}</Text>
                            <Text style={trx.type === 'INCOME' ? s.cellIncome : s.cellExpense}>
                                {trx.type}
                            </Text>
                            <Text style={s.cell}>{formatRp(Number(trx.amount))}</Text>
                        </View>
                    ))}
                </View>

                <View style={s.footer}>
                    <Text>{t('dashboard_pdf.footer')}</Text>
                </View>

            </Page>
        </Document>
    );
};