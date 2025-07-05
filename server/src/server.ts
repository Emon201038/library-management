import app from "./app";
import connectDb from "./app/config/db.config";
import { PORT } from "./secret";


app.listen(PORT, async () => {
  await connectDb()
  console.log("Server is running on port %s. Go to http://localhost:%s", PORT, PORT)
});