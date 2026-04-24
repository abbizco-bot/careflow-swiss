import "dotenv/config";
import { createApp } from "./app";

const PORT = 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`CareFlow API läuft auf http://localhost:${PORT}`);
});
