import { Task } from '../models/Task.js';

export const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user._id });
  res.json(task);
};

export const getTasks = async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const tasks = await Task.find(filter);
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};
