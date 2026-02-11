import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, IconButton, Button } from "react-native-paper";

interface ClubProps {
  id_club: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  nombre_rama?: string;
  onDelete: (id: number) => void;
}

export function ClubCard({
  id_club,
  nombre,
  descripcion,
  fecha_creacion,
  nombre_rama,
  onDelete,
}: ClubProps) {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Title
        title={nombre}
        titleVariant="titleLarge"
        subtitle="Club"
        right={(props) => (
          <IconButton
            {...props}
            icon="delete-outline"
            iconColor="#B00020"
            onPress={() => onDelete(id_club)}
          />
        )}
      />

      <Card.Content style={styles.content}>
        <Text variant="bodyMedium" numberOfLines={3} style={styles.bio}>
          {descripcion || "Sin descripción disponible."}
        </Text>
        <Text variant="bodyMedium" numberOfLines={3} style={styles.text}>
          {fecha_creacion || "Sin fecha de creación disponible."}
        </Text>
        <Text variant="bodyMedium" numberOfLines={3} style={styles.bio}>
          {nombre_rama || "Sin rama disponible."}
        </Text>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="text"
          onPress={() => console.log("Ver más no hace nada", id_club)}
        >
          Ver más
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  content: {
    marginTop: 8,
  },
  bio: {
    color: "#000000ff",
    lineHeight: 20,
  },
  text: {
    color: "#000000ff",
  },
});
