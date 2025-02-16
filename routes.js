import { Router } from "express";
import Todo from "./models/Todo.js";
import { v4 as uuidV4 } from "uuid";
import mongoose from "mongoose";

const route = Router();

const errorCatch = (res, msg, err) => {
  console.log("Error at", msg, ":", err);
  res.status(500).json({ error: "Server Side Error", message: err.message });
};

route.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    errorCatch(res, "GET /todos", err);
  }
});

route.post("/todos", async (req, res) => {
  try {
    const { todo, completed = false } = req.body;
    const id = uuidV4();
    const newTodo = new Todo({ todo, completed, id });
    await newTodo.save();
    res.status(201).json("Todo added");
  } catch (err) {
    errorCatch(res, "POST /todos", err);
  }
});

route.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json("Todo Updated");
  } catch (err) {
    errorCatch(res, "PUT /todos/:id", err);
  }
});

route.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json("Todo delete");
  } catch (err) {
    errorCatch(res, "DELETE /todos/:id", err);
  }
});

export default route;
