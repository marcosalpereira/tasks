# Tasks

Essa aplicação tem o objetivo de controlar o tempo apropriado no ALM de forma mais precisa.

Ela é composta de um aplicativo frontend escrito em angular e contruído para executar em modo standalone com o electron. E um backend java com o selenium para fazer as apropriações no ALM.



## Como executar

Temporariamente (kkkk), para executar o *apropriator* faça:

```bash
git clone https://github.com/marcosalpereira/tasks.git
cd tasks

npm run init-app
```

## Como configurar

Clique no icone do menu *hamburger* para ver o formulario de configuração:

- Pasta onde se encontra o alm-apropriator-?-jar

    EX: '/path/to/tasks/bin'

- CPF:

    informe seu CPF

- Navegador:

    informe 'firefox' ou 'chrome'

- Nome de um profile do firefox (caso tenha escolhido firefox)

    Opcionalmente, informe um profile do firefox

- Caminho para o Navegador:

    Ex: /usr/bin/firefox

- Tamanho da Lista tarefas frequentes

    Tamanho desejado;M eX: 20

## Criar uma tarefa

Clique no icone do menu *hamburger* para abrir ver o formulario de Criar/Iniciar Tarefa:

- Project

    Use o botão '+' para criar um novo projeto. Esse projeto tem que ser o nome da área no ALM. Ex: 'DEDAT - Departamento de Arquitetura'

- Task Code

    O número do item de trabalho que o ALM gera quando se cria uma nova tarefa: Ex: 1866327

- Task Name:

    O nome da tarefa. Pode ser qualquer nome, por exemplo o próprio nome do item no ALM

- Já iniciar essa tarefa

    Marque se desejar que ao submeter a tarefa já comece a contar o tempo

- Observação

    Um complemento descritivo, opcional, para a tarefa

## Registro das atividades

No dia a dia, a idéia, é ao começar uma tarefa, iniciar a contagem de tempo nela.
Para tarefas existente, no painel de 'Evento', clique no icone de 'reciclagem'.
Para novas tarefas, acesse o menu e crie a tarefa nova.

Ao final do dia, verifique os paineis de **Resumo** ou **Gráfico** para ver os totais trabalhados. Clique no botão de Apropriação (Icone com um **A**)

![Veja esse vídeo para maiores informações](demo.ogv)



