import { motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const AboutContent = () => {
  const { language } = useLanguage();
  
  const content = {
    pt: {
      title: 'Sobre Nós',
      subtitle: 'Conheça a AutoTok',
      description: 'Somos uma empresa dedicada a revolucionar a forma como criadores de conteúdo e agências gerenciam suas redes sociais. Nossa plataforma oferece ferramentas poderosas de automação que economizam tempo e maximizam resultados.',
      mission: {
        title: 'Nossa Missão',
        text: 'Empoderar criadores e agências com tecnologia de ponta para automatizar e otimizar sua presença digital, permitindo que foquem no que realmente importa: criar conteúdo incrível.'
      },
      values: {
        title: 'Nossos Valores',
        items: ['Inovação', 'Segurança', 'Simplicidade', 'Resultados']
      }
    },
    en: {
      title: 'About Us',
      subtitle: 'Meet AutoTok',
      description: 'We are a company dedicated to revolutionizing how content creators and agencies manage their social media. Our platform offers powerful automation tools that save time and maximize results.',
      mission: {
        title: 'Our Mission',
        text: 'Empower creators and agencies with cutting-edge technology to automate and optimize their digital presence, allowing them to focus on what really matters: creating amazing content.'
      },
      values: {
        title: 'Our Values',
        items: ['Innovation', 'Security', 'Simplicity', 'Results']
      }
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              {t.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-gradient p-8 rounded-2xl border border-border/50"
            >
              <h2 className="text-2xl font-bold mb-4 text-gradient">{t.mission.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.mission.text}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card-gradient p-8 rounded-2xl border border-border/50"
            >
              <h2 className="text-2xl font-bold mb-4 text-gradient">{t.values.title}</h2>
              <ul className="space-y-3">
                {t.values.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const About = () => (
  <LanguageProvider>
    <AboutContent />
  </LanguageProvider>
);

export default About;
