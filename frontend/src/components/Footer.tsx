import { Linkedin, Github, Mail } from 'lucide-react'

// Links sociais apenas com LinkedIn, GitHub e E-mail
const socialLinks = [
    { 
        icon: Linkedin, 
        href: 'https://www.linkedin.com/in/luan-palma-057135348', 
        label: 'LinkedIn' 
    },
    { 
        icon: Github, 
        href: 'htthttps://github.com/Lusilpa', 
        label: 'GitHub' 
    },
    { 
        icon: Mail, 
        href: 'mailto:luanpalma525@exemplo.com',
        label: 'E-mail' 
    },
]

export function Footer() {
    return (
        <footer className="py-10 md:py-16 border-t">
            <div className="mx-auto max-w-5xl px-6 flex flex-col items-center text-center gap-8">
                
                {/* Links Sociais usando a tag <a> padrão do HTML */}
                <div className="flex justify-center gap-6">
                    {socialLinks.map((social, index) => {
                        const Icon = social.icon
                        return (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="text-muted-foreground hover:text-primary transition-colors duration-150"
                            >
                                <Icon className="size-6" />
                            </a>
                        )
                    })}
                </div>

                {/* Conteúdo de Texto */}
                <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                        &copy; {new Date().getFullYear()} De Olho na Segurança do Trabalho. Todos os direitos reservados.
                    </p>
                    <p>
                        Desenvolvido por <span className="font-semibold text-foreground">Luan Palma</span>, utilizando dados do Portal de Dados Públicos do Governo Federal (dados.gov.br).
                    </p>
                </div>
                
            </div>
        </footer>
    );
}