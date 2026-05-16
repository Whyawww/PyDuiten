import { useTranslation } from 'react-i18next';

export const PrivacyContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">{t('legal.privacy_sec1_title')}</h3>
            <p>{t('legal.privacy_sec1_desc')}</p>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">{t('legal.privacy_sec2_title')}</h3>
            <p>{t('legal.privacy_sec2_desc')}</p>
        </>
    );
};

export const TermsContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">{t('legal.terms_sec1_title')}</h3>
            <p>{t('legal.terms_sec1_desc')}</p>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">{t('legal.terms_sec2_title')}</h3>
            <p>{t('legal.terms_sec2_desc')}</p>
        </>
    );
};