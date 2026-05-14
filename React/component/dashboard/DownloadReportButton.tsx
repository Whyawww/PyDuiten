import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { FinancialReportPDF } from './FinancialReportPDF';
import type { ReportData } from './FinancialReportPDF';

type DownloadReportButtonProps = Omit<ReportData, 'dateRange'> & {
    filter: string;
};

export const DownloadReportButton = ({
    userName,
    filter,
    summary,
    transactions,
    analysisNote,
}: DownloadReportButtonProps) => {
    const fileName = `Laporan_PyDuiten_${filter.replace(/\s+/g, '_')}.pdf`;

    return (
        <PDFDownloadLink
            document={
                <FinancialReportPDF
                    data={{ userName, dateRange: filter, summary, transactions, analysisNote }}
                />
            }
            fileName={fileName}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200
                dark:border-gray-700 rounded-2xl px-5 py-2.5 shadow-sm hover:border-primary
                hover:text-primary transition-all font-bold text-sm text-gray-700
                dark:text-gray-300 active:scale-95"
        >
            {({ loading, error }) => {
                if (error) {
                    console.error('Gagal generate PDF:', error);
                    return (
                        <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-500">Error, coba lagi</span>
                        </>
                    );
                }
                if (loading) {
                    return (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span>Menyiapkan...</span>
                        </>
                    );
                }
                return (
                    <>
                        <Download className="w-4 h-4" />
                        <span>Ekspor PDF</span>
                    </>
                );
            }}
        </PDFDownloadLink>
    );
};