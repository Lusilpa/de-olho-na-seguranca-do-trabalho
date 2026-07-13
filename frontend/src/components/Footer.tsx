export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 p-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>© 2026 De Olho na Segurança do Trabalho. Dados públicos de CATs.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://github.com/Lusilpa/de-olho-na-seguranca-do-trabalho" target="_blank" rel="noreferrer" className="hover:text-orange-500">
            GitHub
          </a>
          <a href="mailto:luanpalma525@gmail.com" className="hover:text-orange-500">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}
