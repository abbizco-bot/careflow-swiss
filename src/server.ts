import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import shiftRouter from "./modules/shifts/shift.routes";
import assignmentRouter from './modules/assignments/assignment.routes'

console.log("SERVER FILE MARKER: ALFRED-TEST-31-03");

const app = express();

app.use((req, _res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());
app.use('/assignments', assignmentRouter)

app.get("/", (_req, res) => {
  res.json({ message: "CareFlow API läuft." });
});
app.get("/shifts-test", (_req, res) => {
  res.json({ message: "server route works" });
});
console.log("shiftRouter loaded:", typeof shiftRouter);
app.use("/shifts", shiftRouter);

app.get("/employees", async (_req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { id: "asc" },
    });
    res.json(employees);
  } catch (error) {
    console.error("Fehler beim Laden der Mitarbeitenden:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.post("/employees", async (req, res) => {
  try {
    const { name, role, workload } = req.body;

    if (!name || !role || typeof workload !== "number") {
      res.status(400).json({
        error: "Bitte name, role und workload korrekt angeben.",
      });
      return;
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        role,
        workload,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error("Fehler beim Erstellen eines Mitarbeitenden:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

const PORT = 3001;

console.log("REGISTERED TEST ROUTE: /shifts-test");

app.listen(PORT, () => {
  console.log(`CareFlow API läuft auf http://localhost:${PORT}`);
});