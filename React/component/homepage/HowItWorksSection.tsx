export const HowItWorksSection = () => {
    const steps = [
        {
            number: '01',
            title: 'Catat Transaksi',
            description: 'Masukin gaji masuk atau duit jajan yang keluar. Cuma butuh 5 detik.',
            color: 'bg-primary/20 text-primary'
        },
        {
            number: '02',
            title: 'Dianalisis AI',
            description: 'Sistem kita otomatis ngitung sisa saldo dan ngirim datanya ke otak AI.',
            color: 'bg-secondary/20 text-secondary'
        },
        {
            number: '03',
            title: 'Terima Roasting',
            description: 'Baca masukan dari AI biar lu makin semangat nabung (atau tobat jajan).',
            color: 'bg-tertiary/40 text-yellow-800'
        }
    ];

    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/3">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-6 tracking-tight leading-tight">
                            Gampang Banget <br />
                            <span className="text-primary">Cara Mainnya.</span>
                        </h2>
                        <p className="text-gray-600 font-medium">
                            Ngga perlu mikir keras atau belajar akuntansi. Cukup lakuin 3 langkah ini dan biarin sistem yang kerja buat lu.
                        </p>
                    </div>

                    <div className="md:w-2/3 grid sm:grid-cols-3 gap-6 relative">
                        {steps.map((step, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mb-6 ${step.color}`}>
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};