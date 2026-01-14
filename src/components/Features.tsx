import { motion } from 'framer-motion';
import { Rocket, Lock, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap = {
  autoPublish: Rocket,
  secure: Lock,
  scale: TrendingUp,
};

export const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      key: 'autoPublish' as const,
      icon: iconMap.autoPublish,
      title: t.features.autoPublish.title,
      description: t.features.autoPublish.description,
      gradient: 'from-cyan to-cyan/50',
    },
    {
      key: 'secure' as const,
      icon: iconMap.secure,
      title: t.features.secure.title,
      description: t.features.secure.description,
      gradient: 'from-yellow-500 to-yellow-500/50',
    },
    {
      key: 'scale' as const,
      icon: iconMap.scale,
      title: t.features.scale.title,
      description: t.features.scale.description,
      gradient: 'from-magenta to-magenta/50',
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          {t.features.title}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="h-full p-8 rounded-2xl card-gradient border border-border/50 hover:border-primary/30 transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-6 h-6 text-background" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
