import { motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactContent = () => {
  const { language } = useLanguage();
  
  const content = {
    pt: {
      title: 'Contato',
      subtitle: 'Fale Conosco',
      description: 'Tem alguma dúvida ou sugestão? Entre em contato conosco e responderemos o mais breve possível.',
      form: {
        name: 'Nome',
        email: 'E-mail',
        message: 'Mensagem',
        send: 'Enviar Mensagem'
      },
      info: {
        email: 'contato@autotok.com',
        phone: '+55 (11) 99999-9999',
        address: 'São Paulo, Brasil'
      }
    },
    en: {
      title: 'Contact',
      subtitle: 'Get in Touch',
      description: 'Have any questions or suggestions? Contact us and we will respond as soon as possible.',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message'
      },
      info: {
        email: 'contact@autotok.com',
        phone: '+55 (11) 99999-9999',
        address: 'São Paulo, Brazil'
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16"
          >
            {t.description}
          </motion.p>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-gradient p-8 rounded-2xl border border-border/50"
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.name}</label>
                  <Input placeholder={t.form.name} className="bg-background/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.email}</label>
                  <Input type="email" placeholder={t.form.email} className="bg-background/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.message}</label>
                  <Textarea placeholder={t.form.message} rows={5} className="bg-background/50" />
                </div>
                <Button className="w-full bg-gradient-primary text-primary-foreground font-semibold rounded-full">
                  {t.form.send}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="card-gradient p-6 rounded-2xl border border-border/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-cyan" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{t.info.email}</p>
                </div>
              </div>

              <div className="card-gradient p-6 rounded-2xl border border-border/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-magenta/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-magenta" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{t.info.phone}</p>
                </div>
              </div>

              <div className="card-gradient p-6 rounded-2xl border border-border/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cyan" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{t.info.address}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Contact = () => (
  <LanguageProvider>
    <ContactContent />
  </LanguageProvider>
);

export default Contact;
