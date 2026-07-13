<h1 align = "center">De Olho Na Segurança do Trabalho</h1>
<h2 align = "center"> IA & Dados | Full-Stack </h2>
<p align = "center"> <i> Plataforma Web que ler e interpreta dados públicos (dados.gov.br) de CATs abertas entre 2021 e 2026 </i></p>

---

## Objetivos

Desenvolver uma plataforma utilizando dados públicos do governo federal (dados.gov.br) com o objetivo de demostrar o uso de ferramentas de leitura e interpretação de dados para deliberar sobre riscos no ambiente de trabalho.

### Objetivos Especificos

- Demonstrar da utilidade de dados públicos.
- Apresentar a magnitude do poder da biblioteca Pandas alinhada com a APIFAST da linguagem Python.

## Caixa de Tecnologias

#### Back-end e Motor de Dados
[![PYTHON](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://docs.python.org/3/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![PANDAS](https://img.shields.io/badge/Pandas-2C2D72?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)

#### Front-end e Designer
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

#### Versionamento de Código
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lusilpa/de-olho-na-seguranca-do-trabalho)

#### Fonte de Dados
Os dados brutos utilizados nesta aplicação são extraídos do **Portal de Dados Abertos do Governo Federal** (dados.gov.br), especificamente a base histórica de Comunicações de Acidente de Trabalho (CAT). 

Para facilitar a execução local e contornar os limites de tamanho do GitHub, a base de dados completa (2021 a 2026) foi consolidada e está disponível para download no link abaixo:

[![Google Drive](https://img.shields.io/badge/Acessar_Base_de_Dados-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1mPm0ElAIwSM869zawrSZVeO8Dd84ic58?usp=drive_link)

## Funcionalidades Principais

### 1. Analise de Dados Macro
A Página principal do projeto conta com um dashboard demostrando os seguintes pontos.
*  **Cards Interativos**: Em destaque ja é possivel ver números com cards de todos os dados (Total de CATs, Obitos, C/ Afastamento, S/ Afastamento, Media Mensal, Media Anual, Tendencia - ano vs ano anterior)
*  **Gráfico de Evolução**: Um gráfico que analise no eixo X (Periodo) e no eixo Y (Quantidade de CATs), sendo por filtros macros.

Além disso, pode explorar mais ainda os dados na tela home

### 2. Filtros e Selos

A seguranda funcionalidade e creio ser uma das principais, seja os filtros e selos.

#### Selos

É algo mais simbolico dado a CNPJ, quando é pesquisado por eles.
- Selo Gama - Destinado a CNPJ com nenhum registro nos últimos 5 anos.
- Selo Alpha - Destinado a CNPJ que aparece ao menos 1 vez e menos de 10 vezes.
- Selo Beta - Destinado a CNPJ que aparece ao mais de 10 vezes e menos de 100.

#### Filtros

É possível refinar a busca na base de dados utilizando os seguintes parâmetros:
- CNPJ
- Setor Econômico (CNAE)
- UF / Município
- Tipo de Acidente
- CID-10 (Classificação Internacional de Doenças)

## Como Rodar o Projeto

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
* [Python 3.x](https://www.python.org/downloads/)
* [Node.js e npm](https://nodejs.org/)
* [Git](https://git-scm.com/)

### 1. Clonando o Repositório
No seu terminal, rode os comandos abaixo para baixar o código e entrar na pasta do projeto:
```bash
git clone [https://github.com/Lusilpa/de-olho-na-seguranca-do-trabalho.git](https://github.com/Lusilpa/de-olho-na-seguranca-do-trabalho.git)
cd de-olho-na-seguranca-do-trabalho
```

### 2. Configurando BackEnd

```bash

cd backend # Entrar na pasta do Backend

python -m venv venv #Criar o ambiente virtual para o isolamente de bibliotecas

.\venv\Scripts\activate # Ativar o ambiente virtual no terminal

pip install fastapi unicorn pandas # Instalar as dependencias

uvicorn api.main:app --reload # inicializar o servidor

```

### 3. Configurando Interface

```bash

cd frontend #Entrar na pasta do frontend

npm install #Instalar todas as dependencias do sistema

npm run dev #Inicializar o Vite

```

O projeto estará rondando no seu navedor em:

```bash 

http://localhost:5173

```
---

## 👨‍💻 Autor

Desenvolvido por **Luan Palma**.

Engenharia de Software e Recursos Humanos andando juntos para criar soluções que impactam a rotina do Departamento Pessoal e a segurança dos colaboradores. Sinta-se à vontade para entrar em contato, tirar dúvidas ou contribuir com o projeto!

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lusilpa)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luan-palma-057135348)
[![E-mail](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:luanpalma525@gmail.com)

## 📄 Licença

Este projeto está sob a licença [MIT](https://choosealicense.com/licenses/mit/) - sinta-se livre para usar, modificar e distribuir os códigos.

<br>

<p align="center">
  <i>"Transformando dados públicos em ambientes de trabalho mais seguros."</i>
</p>