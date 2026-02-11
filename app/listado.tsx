import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";
import { ClubCard } from "../src/components/ClubCard";
import api from "../src/services/api";

export default function Listado() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Helper para mostrar mensajes (Multiplataforma)
  const showSimpleAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // 2. Función para obtener directores (GET)
  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get("/clubs");
      // Recordatorio: nuestro interceptor ya devuelve el .data de axios
      setClubs(data.datos);
    } catch (error: any) {
      showSimpleAlert(
        "Error",
        error.mensaje || "No se pudieron cargar los datos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Refrescar datos cuando la pantalla gana el foco
  //   Con useFocusEffect, la función fetchDirectors() se ejecuta
  //   cada vez que el usuario entra en la pestaña.
  //   lleva un useCallback dentro para evitar bucles infinitos.
  //   useCallback memoriza la función
  useFocusEffect(
    useCallback(() => {
      fetchClubs();
    }, [fetchClubs]),
  );

  // 4. Lógica de borrado (Multiplataforma)
  const handleDelete = (id: number) => {
    const title = "Eliminar";
    const msg = "¿Estás seguro de que quieres eliminar este club?";

    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${msg}`)) {
        ejecutarBorrado(id);
      }
    } else {
      Alert.alert(title, msg, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => ejecutarBorrado(id),
          style: "destructive",
        },
      ]);
    }
  };

  const ejecutarBorrado = async (id: number) => {
    try {
      await api.delete(`/clubs/${id}`);
      showSimpleAlert("Éxito", "Club eliminado");
      fetchClubs(); // Recargar la lista tras borrar
    } catch {
      showSimpleAlert("Error", "No se pudo eliminar el registro");
    }
  };

  // 5. Renderizado
  if (loading && clubs.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} color="#6200ee" size="large" />
        <Text style={{ marginTop: 10 }}>Cargando clubs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clubs}
        keyExtractor={(item: any) => item.id_club.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ClubCard
            id_club={item.id_club}
            nombre={item.nombre}
            descripcion={item.descripcion}
            fecha_creacion={item.fecha_creacion}
            nombre_rama={item.nombre_rama}
            onDelete={() => handleDelete(item.id_club)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text variant="bodyLarge">No hay clubes disponibles</Text>
          </View>
        }
      />

      {/* Botón flotante para refrescar manualmente */}
      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={fetchClubs}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Espacio para que el FAB no tape la última card
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
});
