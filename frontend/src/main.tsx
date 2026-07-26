/*
   Em português:
   Na programação o arquivo/função "main.ts" é geralmente o ponto de entrada principal de um aplicativo TypeScript. 
   Ele contém o código que inicializa e configura o aplicativo, incluindo a importação de módulos, a definição de variáveis e funções principais, 
   e a execução do código principal do aplicativo.

   In English:
    In programming, the "main.ts" file/function is typically the main entry point of a TypeScript application.
    He contains the code that initializes and configures the application, including importing modules, defining main variables and functions,
    and executing the main application code.
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando os componentes base
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';

// Importando as suas páginas
import { Home } from './pages/home';
import { Filter } from './pages/filter';
import { Documentation } from './pages/documentation';
import { Dashboard } from './pages/dashboard';
import { CnpjPage } from './pages/cnpj';

import './style.css'; // Ou o nome do seu arquivo CSS principal

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Navbar fica fora das Routes para aparecer em todas as páginas */}
      <Navbar />
      
      {/* Container principal para as páginas. 
          O pt-24 (padding-top) evita que a Navbar fixa cubra o conteúdo da página */}
      <main className="pt-24 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/filtros" element={<Filter />} />
          <Route path="/documentacao" element={<Documentation />} />
          <Route path="/cnpj" element={<CnpjPage />} />
        </Routes>
      </main>

      {/* Footer também aparece em todas as páginas */}
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);