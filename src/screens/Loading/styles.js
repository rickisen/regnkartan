import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29347A",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    backgroundColor: "rgba(0,50,100,0.8)",
    position: "absolute",
    borderRadius: 20,
    padding: 20,
    bottom: 200,
  },
  labelText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  progressLine: { position: "absolute", bottom: 150 },
});
