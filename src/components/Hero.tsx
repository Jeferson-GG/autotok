import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { RocketSVG } from './RocketSVG';
import { Button } from './ui/button';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-glow blur-[120px] opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-magenta-glow blur-[100px] opacity-15"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Decorative card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block w-64 h-80"
          >
            <div className="w-full h-full rounded-2xl card-gradient border border-border/50 p-6 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-cyan/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">Acompanhe seu crescimento em tempo real</p>
              </div>
              <motion.div 
                className="relative z-10 flex gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="h-16 w-4 bg-cyan/40 rounded-full" />
                <div className="h-20 w-4 bg-cyan/60 rounded-full" />
                <div className="h-12 w-4 bg-cyan/30 rounded-full" />
                <div className="h-24 w-4 bg-cyan/80 rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          {/* Center - Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl"
          >
            {/* Rocket */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <RocketSVG />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t.hero.title}
              <br />
              <span className="text-gradient">{t.hero.subtitle}</span>
            </motion.h1>

            {/* Subtitle text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              A ferramenta profissional para criadores e agências. Agende, gerencie e publique seu conteúdo com segurança.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full glow-primary hover:opacity-90 transition-opacity"
              >
                {t.hero.cta}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Decorative card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block w-64 h-80"
          >
            <div className="w-full h-full rounded-2xl card-gradient border border-border/50 p-6 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-magenta/10 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-magenta/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Agendamento</h3>
                <p className="text-sm text-muted-foreground">Publique automaticamente no melhor horário</p>
              </div>
              <motion.div 
                className="relative z-10 space-y-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="h-3 w-full bg-magenta/30 rounded-full" />
                <div className="h-3 w-3/4 bg-magenta/50 rounded-full" />
                <div className="h-3 w-1/2 bg-magenta/70 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-primary opacity-50" />
    </section>
  );
};
