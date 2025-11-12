Sistema de Emissão de Nota Fiscal
# Visão Geral

Este projeto consiste em um sistema completo para emissão e gerenciamento de notas fiscais, integrado a uma API em C# e desenvolvido com Angular no front-end.
O objetivo é facilitar o controle de produtos, criação de notas e acompanhamento de faturamento, com uma interface clara e responsiva.

# Funcionalidades Principais

Cadastro de Produtos: criação, edição e exclusão de produtos com código, descrição e saldo.

Criação de Notas Fiscais: inclusão de múltiplos itens por nota, com validação automática.

Fechamento de Notas: marcação de notas como concluídas e registro de faturamento.

Mensagens Interativas: exibição de alertas de erro e mensagens de sucesso.

Interface Responsiva: design limpo e organizado, com feedback visual ao usuário.

# Tecnologias Utilizadas
Camada	Tecnologias
Front-end	Angular, TypeScript, HTML5, CSS3
Back-end	C# (.NET API)
Banco de Dados	SQL Server
Comunicação	HTTP/REST API


# Como Executar o Projeto
1. Clonar o Repositório
git clone <url-do-repositorio>

2. Executar o Front-end (Angular)
cd frontend
npm install
ng serve


Acesse no navegador:

http://localhost:4200

3. # Executar o Back-end (C# API)

Abra o projeto no Visual Studio ou use o comando:

dotnet run


Certifique-se de que o banco de dados está configurado corretamente no arquivo appsettings.json.


Igor Vinicius Araújo Pece dos Santos
Projeto desenvolvido como estudo e portfólio, com foco na integração entre Angular e C#.
