import { motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Rocket, Shield, TrendingUp, Zap, Clock, Users } from 'lucide-react';

const ResourcesContent = () => {
  const { language } = useLanguage();
  
  const content = {
    pt: {
      title: 'Recursos',
      subtitle: 'Tudo que você precisa para crescer',
      features: [
        {
          icon: Rocket,
          title: 'Publicação Automática',
          description: 'Agende e publique conteúdo automaticamente em todas as suas plataformas favoritas.'
        },
        {
          icon: Shield,
          title: 'Segurança Avançada',
          description: 'Seus dados são protegidos com criptografia de ponta e autenticação OAuth2.'
        },
        {
          icon: TrendingUp,
          title: 'Analytics Detalhado',
          description: 'Acompanhe o desempenho do seu conteúdo com métricas e insights em tempo real.'
        },
        {
          icon: Zap,
          title: 'Performance Otimizada',
          description: 'Algoritmos inteligentes para postar no melhor horário e maximizar engajamento.'
        },
        {
          icon: Clock,
          title: 'Agendamento Inteligente',
          description: 'Planeje semanas de conteúdo antecipadamente com nosso calendário visual.'
        },
        {
          icon: Users,
          title: 'Multi-Contas',
          description: 'Gerencie múltiplas contas e perfis a partir de um único painel de controle.'
        }
      ]
    },
    en: {
      title: 'Resources',
      subtitle: 'Everything you need to grow',
      features: [
        {
          icon: Rocket,
          title: 'Auto-Publish',
          description: 'Schedule and automatically publish content across all your favorite platforms.'
        },
        {
          icon: Shield,
          title: 'Advanced Security',
          description: 'Your data is protected with end-to-end encryption and OAuth2 authentication.'
        },
        {
          icon: TrendingUp,
          title: 'Detailed Analytics',
          description: 'Track your content performance with real-time metrics and insights.'
        },
        {
          icon: Zap,
          title: 'Optimized Performance',
          description: 'Smart algorithms to post at the best time and maximize engagement.'
        },
        {
          icon: Clock,
          title: 'Smart Scheduling',
          description: 'Plan weeks of content ahead with our visual calendar.'
        },
        {
          icon: Users,
          title: 'Multi-Account',
          description: 'Manage multiple accounts and profiles from a single dashboard.'
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
            <p className="text-xl text-gradient">{t.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {t.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-gradient p-8 rounded-2xl border border-border/50 group hover:border-cyan/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Resources = () => (
  <LanguageProvider>
    <ResourcesContent />
  </LanguageProvider>
);

export default Resources;
