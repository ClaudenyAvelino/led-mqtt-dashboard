## 👨‍🏫 Professor

**Nome:** Claudeny Avelino  
**E-mail:** claudeny.avelino@gmail.com  
**Turma:** JOVEM-TECH-ReactJS-ESP8266

# Controle de LED via MQTT (React + ESP8266)

Este projeto permite controlar um LED conectado a um **ESP8266** via **MQTT**, usando uma interface web construída com **React**.  
O backend MQTT pode ser hospedado no HiveMQ ou outro broker compatível.  

## 🧾 Exemplo de Interface Web

![Projeto](/src/assets/reactMqtt.png "Monitor ESP8266")

O projeto inclui:

- **Front-end React** para ligar/desligar o LED e exibir o status atual.
- **ESP8266** que se conecta ao MQTT e controla fisicamente o LED.
- **Sincronização de estado** usando mensagens MQTT com retain para refletir corretamente o estado do LED mesmo após recarregar a página.

---

## 📦 Tecnologias usadas

- **Front-end:** React, MQTT.js, CSS
- **Back-end/Dispositivo:** ESP8266, Arduino IDE, PubSubClient
- **Broker MQTT:** HiveMQ (ou qualquer broker MQTT compatível)
- **Gerenciamento de estado local:** `localStorage` para manter o estado entre recarregamentos

---

## ⚙️ Pré-requisitos

- Node.js (v18+ recomendado)
- npm ou yarn
- Arduino IDE ou PlatformIO para ESP8266
- Broker MQTT ativo (HiveMQ Cloud ou outro)

---

## 🔧 Configuração do Front-end

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_PROJETO>
```
Instale dependências:

npm install
# ou
yarn install


Crie um arquivo .env na raiz do projeto:
~~~
VITE_MQTT_URL=<URL_DO_BROKER>
VITE_MQTT_USERNAME=<USUARIO_MQTT>
VITE_MQTT_PASSWORD=<SENHA_MQTT>
~~~

# Inicie a aplicação:
~~~
npm run dev
# ou
yarn dev
~~~

Acesse a interface no navegador:
~~~
http://localhost:5173
~~~
# 🖥️ Código do ESP8266

O ESP8266 conecta-se ao mesmo broker MQTT e controla o LED físico:

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
~~~
const char* ssid = "SEU_WIFI";
const char* password = "SENHA_WIFI";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

const int ledPin = 2;
String ledState = "off";
~~~
> Funções setup_wifi(), reconnect() e callback() conforme exemplo do código principal


* Publish retain: o ESP8266 publica o status do LED com retain=true para que novos clientes recebam automaticamente o estado correto.
* Controle via tópico: led/control → liga/desliga, led/status → estado atual.

# 🎯 Funcionamento

1. O usuário clica no botão na interface React.
1. O React publica no tópico led/control.
1. O ESP8266 recebe a mensagem, atualiza o LED e publica o estado no tópico led/status com retain.
1. O React escuta led/status e atualiza a interface.
1. O estado do LED é salvo no localStorage para que recarregamentos de página não alterem a interface.

# 💡 Boas práticas

Use retained messages para sincronizar o estado inicial do LED.

Utilize localStorage para persistir o estado da interface sem impactar o dispositivo.

Para produção, use usuário/senha MQTT e conexões seguras (mqtts://) para proteger o tráfego.

# 📌 Estrutura do projeto
~~~
.
├─ src/
│  ├─ App.jsx
│  └─ styles.css
├─ public/
├─ .env
└─ package.json
~~~
# 🛠️ Próximos passos / melhorias

* Suporte a múltiplos LEDs com tópicos separados.
* Adicionar reconexão automática e fallback em caso de falha de broker.
* Interface responsiva para mobile.
* Notificações em tempo real para alterações externas no LED.
