# Cadastro de carros

**RF**
Deve ser possível cadastrar um novo carro

**RN**
Não deve ser possível cadastrar um carro com uma placa já existente.
O carro deve ser cadastrado com disponibilidade, por padrão.
O usuário responsável pelo cadastro deve ser um usuário adm.

# Listagem de carros

**RF**
Deve ser possível listar os carros disponíveis
Deve ser possível listar todos os carros disponíveis pelo nome da categorias
Deve ser possível listar todos os carros disponíveis pelo nome da marca
Deve ser possível listar todos os carros disponíveis pelo nome do carro

**RN**
O usuário não precisa estar logado no sistema

# Cadastro de especificação no carro

**RF**
Deve ser possível cadastrar uma especificação para o carro
Deve ser possível listar todas as especificações
Deve ser possível listar todos os carros
O usuário responsável pelo cadastro deve ser um usuário adm.

**RN**
Não deve ser possível cadastrar uma especificação para um carro não cadastrado
Não deve ser possível cadastrar uma especificação já existente para o mesmo carro

# Cadastro de imagens do carro

**RF**
Deve ser possível cadastrar a imagem do carro
Deve ser possível listar todos os carros

**RNF**
Utilizar o multer para upload dos arquivos

**RN**
O usuário deve poder cadastrar mais de 1 imagem pro mesmo carro
O usuário responsável pelo cadastro deve ser um usuário adm.

## Aluguel

**RF**
Deve ser possível cadastrar um aluguel

**RN**
O aluguel deve ter duração minima de 24h
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro

## Recuperar Senha

**RF**
Deve ser possível recuperar a senha informando o e-mail
O usuário deve recever um e-mail com o passo a passo para a recupareção da senha
O usuário deve conseguir inserir uma nova senha

**RN**
O usuário precisa informar uma nova senha
O link enviado para a recuperação deve expirar em 3 horas
