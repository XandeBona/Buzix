# Buzix - Mobilidade Inteligente

## Descrição
**Buzix** é um sistema de mobilidade inteligente que auxilia os usuários de transporte público, fornecendo informações sobre linhas, itinerários e pontos de ônibus.  
Através de um mapa interativo, o usuário pode:

- Clicar em um ponto de ônibus para ver as linhas que passam nele.
- Selecionar uma linha e visualizar o itinerário correspondente.
- Exibir a rota completa no mapa, com destaque nos pontos de parada.

Além disso, o Buzix permite que **empresas de transporte** gerenciem suas linhas, veículos, itinerários e pontos de ônibus. É possível cadastrar, editar, excluir e até importar pontos em massa via arquivos KMZ.  

O sistema também integra a **OpenAI** para validar a manutenção dos veículos: o usuário insere a quilometragem do ônibus e a IA indica se já está na hora de realizar a manutenção ou substituição.

---

## Funcionalidades
- Visualização de pontos de ônibus e linhas no mapa.
- Exibição de itinerários detalhados e rotas desenhadas no mapa.
- Gerenciamento completo de linhas, veículos, itinerários e pontos pelas empresas.
- Importação de pontos via arquivos KMZ.
- Validação automática de manutenção de veículos com IA.
- Busca de endereços integrada com Nominatim.

---

## Tecnologias Utilizadas
O projeto foi desenvolvido com as seguintes tecnologias:

- **Back-end:** ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
- **Front-end:** ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Leaflet](https://img.shields.io/badge/Leaflet-1991D4?style=for-the-badge) ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EB26D?style=for-the-badge)
- **APIs externas:** ![GraphHopper](https://img.shields.io/badge/GraphHopper-FF6F00?style=for-the-badge) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) ![Nominatim](https://img.shields.io/badge/Nominatim-00A86B?style=for-the-badge)
- **Banco de dados:** ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
- **Hospedagem:** ![RailWay](https://img.shields.io/badge/RailWay-0052CC?style=for-the-badge)

---

## Como Rodar Localmente
1. Certifique-se de ter o **Java** e o **MySQL** configurados na sua máquina.
2. No arquivo `application.properties`, selecione o **perfil `dev`**.
3. Inicialize o projeto via Spring Boot.  
4. O banco de dados precisa conter as tabelas padrão do sistema (users, bus_stops, vehicles, routes, trips, stop_times).  
5. Acesse a aplicação pelo navegador (localhost).  


---

## Exemplos de Uso
- Visualizar todos os pontos de ônibus em um bairro.
- Selecionar uma linha e ver a rota completa no mapa.
- Cadastrar um novo ônibus e validar período de manutenção via IA.