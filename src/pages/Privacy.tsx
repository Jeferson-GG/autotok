import { motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PrivacyContent = () => {
  const { language } = useLanguage();
  
  const content = {
    pt: {
      title: 'Política de Privacidade',
      lastUpdate: 'Última atualização: Janeiro de 2025',
      sections: [
        {
          title: '1. Coleta de Informações',
          text: 'Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de conta quando você se registra em nossa plataforma. Também coletamos automaticamente certas informações quando você usa nossos serviços.'
        },
        {
          title: '2. Uso das Informações',
          text: 'Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, processar transações, enviar comunicações relacionadas ao serviço e personalizar sua experiência.'
        },
        {
          title: '3. Compartilhamento de Dados',
          text: 'Não vendemos suas informações pessoais. Podemos compartilhar dados com prestadores de serviços que nos ajudam a operar nossa plataforma, sempre sob rigorosos acordos de confidencialidade.'
        },
        {
          title: '4. Segurança',
          text: 'Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.'
        },
        {
          title: '5. Seus Direitos',
          text: 'Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco para exercer esses direitos.'
        },
        {
          title: '6. Cookies',
          text: 'Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o tráfego e personalizar conteúdo.'
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdate: 'Last updated: January 2025',
      sections: [
        {
          title: '1. Information Collection',
          text: 'We collect information you provide directly to us, such as name, email, and account data when you register on our platform. We also automatically collect certain information when you use our services.'
        },
        {
          title: '2. Use of Information',
          text: 'We use your information to provide, maintain and improve our services, process transactions, send service-related communications, and personalize your experience.'
        },
        {
          title: '3. Data Sharing',
          text: 'We do not sell your personal information. We may share data with service providers who help us operate our platform, always under strict confidentiality agreements.'
        },
        {
          title: '4. Security',
          text: 'We implement technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          title: '5. Your Rights',
          text: 'You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.'
        },
        {
          title: '6. Cookies',
          text: 'We use cookies and similar technologies to improve your experience, analyze traffic, and personalize content.'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.title}
            </h1>
            <p className="text-muted-foreground">{t.lastUpdate}</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-8">
            {t.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-gradient p-8 rounded-2xl border border-border/50"
              >
                <h2 className="text-xl font-bold mb-4 text-gradient">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Privacy = () => (
  <LanguageProvider>
    <PrivacyContent />
  </LanguageProvider>
);

export default Privacy;
