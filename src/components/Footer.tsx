import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-muted-foreground text-sm">
            © 2025 AutoTok. {t.footer.rights}
          </p>

          <div className="flex items-center gap-6">
            <motion.a
              href="/privacy"
              className="text-primary hover:text-primary/80 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {t.footer.privacy}
            </motion.a>
            <motion.a
              href="/terms"
              className="text-primary hover:text-primary/80 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {t.footer.terms}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
