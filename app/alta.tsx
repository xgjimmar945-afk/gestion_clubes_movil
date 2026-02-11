import React, { useState, useEffect } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Text,
  TextInput,
  Menu,
  Provider,
  RadioButton,
} from "react-native-paper";
import api from "../src/services/api";

export default function AltaClub() {
  const [club, setClub] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    fecha_fundacion: "",
    id_rama: "",
    presupuesto_inicial: "",
    esta_activo: true,
  });

  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, message?: string) => {
    if (Platform.OS === "web") {
      // window.alert funciona en la web (Expo web)
      window.alert(title + (message ? "\n\n" + message : ""));
    } else {
      Alert.alert(title, message);
    }
  };

  const [ramas, setRamas] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [ramaNombre, setRamaNombre] = useState("");

  useEffect(() => {
    const loadRamas = async () => {
      try {
        const response: any = await api.get("/ramas");
        setRamas(response.datos || []);
      } catch (error) {
        console.error("Error al cargar las ramas:", error);
      }
    };
    loadRamas();
  }, []);

  // Función para enviar los datos
  const handleSave = async () => {
    console.log("[Altaclub] handleSave called — form:", club);
    // Validación simple
    if (!club.nombre || !club.descripcion) {
      showAlert("Error", "Por favor, rellena al menos el nombre y la fecha.");
      return;
    }

    setLoading(true);
    try {
      // Usamos el endpoint para el alta
      await api.post("/clubs", club);

      showAlert("Éxito", "Club guardado correctamente");

      // Limpiar formulario tras éxito
      setClub({
        nombre: "",
        descripcion: "",
        direccion: "",
        fecha_fundacion: "",
        id_rama: "",
        presupuesto_inicial: "",
        esta_activo: true,
      });
    } catch (error: any) {
      // El interceptor que creamos antes manejará el log,
      // aquí mostramos el error en consola y al usuario.
      console.error("[AltaClub] save error:", error);
      showAlert("Error", error?.mensaje || "No se pudo guardar el club");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Nuevo Club
        </Text>

        <TextInput
          label="Nombre del Club"
          value={club.nombre}
          onChangeText={(text) => setClub({ ...club, nombre: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Ej: John Ford"
        />

        <TextInput
          label="Fecha de Fundación (AAAA-MM-DD)"
          value={club.fecha_fundacion}
          onChangeText={(text) => setClub({ ...club, fecha_fundacion: text })}
          mode="outlined"
          multiline
          style={styles.input}
          placeholder="1880-12-12"
        />

        <TextInput
          label="Descripción"
          value={club.descripcion}
          onChangeText={(text) => setClub({ ...club, descripcion: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Presupuesto Inicial"
          value={club.presupuesto_inicial}
          onChangeText={(text) =>
            setClub({ ...club, presupuesto_inicial: text })
          }
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ej: 1000"
        />

        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <TextInput
              label="Rama"
              value={ramaNombre}
              mode="outlined"
              style={styles.input}
              editable={false}
              right={
                <TextInput.Icon
                  icon="chevron-down"
                  onPress={() => setShowMenu(true)}
                />
              }
              onPressIn={() => setShowMenu(true)}
            />
          }
        >
          {ramas.map((rama) => (
            <Menu.Item
              key={rama.id_rama}
              title={rama.nombre_rama}
              onPress={() => {
                setClub({ ...club, id_rama: rama.id_rama });
                setRamaNombre(rama.nombre_rama);
                setShowMenu(false);
              }}
            />
          ))}
        </Menu>

        <TextInput
          label="Dirección"
          value={club.direccion}
          onChangeText={(text) => setClub({ ...club, direccion: text })}
          mode="outlined"
          numberOfLines={4}
          style={styles.input}
        />

        <View style={styles.radioGroup}>
          <Text variant="titleMedium">¿Está activo?</Text>
          <RadioButton.Group
            onValueChange={(newValue) =>
              setClub({ ...club, esta_activo: newValue === "true" })
            }
            value={club.esta_activo ? "true" : "false"}
          >
            <View style={styles.radioItem}>
              <RadioButton value="true" />
              <Text>Activo</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="false" />
              <Text>Inactivo</Text>
            </View>
          </RadioButton.Group>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          icon="content-save"
          style={styles.button}
        >
          Guardar Club
        </Button>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    marginBottom: 24,
    color: "#6200ee",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#4e4242ff",
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
  raadioButton: {
    color: "#000000ff",
  },
  radioGroup: {
    marginTop: 8,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#2312bfff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000000ff",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});
