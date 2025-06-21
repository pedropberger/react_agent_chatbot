curl -X POST http://localhost:1234/api/prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Olá, esta é uma mensagem de teste"}'


# or

import requests
import json

url = "http://localhost:1234/api/prompt"
payload = {"prompt": "texto string aqui"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers)
print(response.json())


Funcionalidades
Endpoint principal: POST /api/prompt
Porta: 1234
Formato de entrada: {'prompt': "texto string aqui"}
Formato de saída: {'resposta': "texto string aqui recebido com sucesso"}
Endpoint de saúde: GET /health para verificar se a API está funcionando
Tratamento de erros para requisições malformadas
Exemplo de resposta
Request:
json
{
  "prompt": "Hello World"
}
Response:
json
{
  "resposta": "texto string aqui recebido com sucesso: Hello World"
}
Esta API é simples, funcional e está pronta para ser estendida conforme suas necessidades específicas!