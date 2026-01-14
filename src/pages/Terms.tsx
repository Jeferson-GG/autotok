import { motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const TermsContent = () => {
  const { language } = useLanguage();
  
  const content = {
    pt: {
      title: 'Termos de Serviço',
      lastUpdate: 'Última atualização: Janeiro de 2025',
      sections: [
        {
          title: '1. Aceitação dos Termos',
          text: 'Ao acessar e usar a plataforma AutoTok, você concorda em cumprir estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.'
        },
        {
          title: '2. Descrição do Serviço',
          text: 'AutoTok é uma plataforma de automação para redes sociais que permite agendar, gerenciar e publicar conteúdo. Reservamos o direito de modificar ou descontinuar o serviço a qualquer momento.'
        },
        {
          title: '3. Conta do Usuário',
          text: 'Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em aceitar responsabilidade por todas as atividades que ocorram sob sua conta.'
        },
        {
          title: '4. Uso Aceitável',
          text: 'Você concorda em não usar o serviço para qualquer finalidade ilegal ou não autorizada. Você não deve violar quaisquer leis em sua jurisdição ao usar o serviço.'
        },
        {
          title: '5. Propriedade Intelectual',
          text: 'O serviço e seu conteúdo original, recursos e funcionalidades são de propriedade da AutoTok e são protegidos por leis de direitos autorais e marcas registradas.'
        },
        {
          title: '6. Limitação de Responsabilidade',
          text: 'Em nenhum caso a AutoTok será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar o serviço.'
        },
        {
          title: '7. Modificações',
          text: 'Reservamos o direito de modificar ou substituir estes termos a qualquer momento. Alterações materiais serão notificadas com pelo menos 30 dias de antecedência.'
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdate: 'Last updated: January 2025',
      sections: [
        {
          title: '1. Acceptance of Terms',
          text: 'By accessing and using the AutoTok platform, you agree to comply with these Terms of Service. If you disagree with any part of these terms, you should not use our services.'
        },
        {
          title: '2. Service Description',
          text: 'AutoTok is a social media automation platform that allows you to schedule, manage, and publish content. We reserve the right to modify or discontinue the service at any time.'
        },
        {
          title: '3. User Account',
          text: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.'
        },
        {
          title: '4. Acceptable Use',
          text: 'You agree not to use the service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction when using the service.'
        },
        {
          title: '5. Intellectual Property',
          text: 'The service and its original content, features, and functionality are owned by AutoTok and are protected by copyright and trademark laws.'
        },
        {
          title: '6. Limitation of Liability',
          text: 'In no event shall AutoTok be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use the service.'
        },
        {
          title: '7. Modifications',
          text: 'We reserve the right to modify or replace these terms at any time. Material changes will be notified at least 30 days in advance.'
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

const Terms = () => (
  <LanguageProvider>
    <TermsContent />
  </LanguageProvider>
);

export default Terms;
