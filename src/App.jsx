import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import "./styles.css";

function App() {
  //const MQTT_URL = import.meta.env.VITE_MQTT_URL;
  const MQTT_URL = "wss://broker.hivemq.cloud:8884/mqtt"; // WebSocket seguro
  const OPTIONS = {
    username: import.meta.env.VITE_MQTT_USERNAME,
    password: import.meta.env.VITE_MQTT_PASSWORD,
  };

  const [ledStatus, setLedStatus] = useState(() => {
    // 🔁 Recupera o último estado salvo no navegador
    return localStorage.getItem("ledStatus") || "off";
  });

  const clientRef = useRef(null);

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_URL, OPTIONS);
    clientRef.current = mqttClient;

    mqttClient.on("connect", () => {
      console.log("Conectado ao HiveMQ!");
      mqttClient.subscribe("led/status");
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === "led/status") {
        const status = message.toString();
        console.log("Status recebido:", status);
        setLedStatus(status);
      }
    });

    return () => mqttClient.end();
  }, []);

  // 💾 Salva o estado localmente sempre que mudar
  useEffect(() => {
    localStorage.setItem("ledStatus", ledStatus);
  }, [ledStatus]);

  const toggleLed = () => {
    const client = clientRef.current;
    if (client) {
      const newState = ledStatus === "on" ? "off" : "on";
      client.publish("led/control", newState);
      setLedStatus(newState);
    }
  };

  return (
    <div className="container">
      <h1>Controle de LED via MQTT (HiveMQ)</h1>

      <button
        onClick={toggleLed}
        className={ledStatus === "on" ? "btn-on" : "btn-off"}
      >
        {ledStatus === "on" ? "🔆 Desligar LED" : "💡 Ligar LED"}
      </button>

      <p>Status atual: <strong>{ledStatus.toUpperCase()}</strong></p>
    </div>
  );
}

export default App;
