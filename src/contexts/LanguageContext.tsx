import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface Translations {
  nav: {
    features: string;
    about: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  features: {
    title: string;
    autoPublish: {
      title: string;
      description: string;
    };
    secure: {
      title: string;
      description: string;
    };
    scale: {
      title: string;
      description: string;
    };
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
}

const translations: Record<Language, Translations> = {
  pt: {
    nav: {
      features: 'Recursos',
      about: 'Sobre',
      contact: 'Contato',
    },
    hero: {
      title: 'Impulsione Seu Negócio',
      subtitle: 'Com Automação Inteligente',
      cta: 'Começar Agora',
    },
    features: {
      title: 'Nossos Recursos',
      autoPublish: {
        title: 'Publicação Automática',
        description: 'Publique conteúdo diretamente sem intervenção manual. Suporte para domínios verificados e uploads de alta qualidade.',
      },
      secure: {
        title: 'Seguro & Protegido',
        description: 'Construído com verificação OAuth2 oficial. Suas credenciais são criptografadas e nunca compartilhadas.',
      },
      scale: {
        title: 'Escale',
        description: 'Perfeito para agências gerenciando múltiplas contas. Otimize seu fluxo de trabalho e economize horas toda semana.',
      },
    },
    footer: {
      rights: 'Todos os direitos reservados.',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
    },
  },
  en: {
    nav: {
      features: 'Features',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      title: 'Boost Your Business',
      subtitle: 'With Intelligent Automation',
      cta: 'Get Started',
    },
    features: {
      title: 'Our Features',
      autoPublish: {
        title: 'Auto-Publish',
        description: 'Post content directly without manual intervention. Support for verified domains and high-quality uploads.',
      },
      secure: {
        title: 'Secure & Safe',
        description: 'Built with official OAuth2 verification. Your credentials are encrypted and never shared.',
      },
      scale: {
        title: 'Scale Up',
        description: 'Perfect for agencies managing multiple accounts. Streamline your workflow and save hours every week.',
      },
    },
    footer: {
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
