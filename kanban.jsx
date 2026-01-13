import React, { useEffect, useState } from "react";
import API from "../api/api";
import { getToken } from "../utils/auth";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Kanban() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await API.get("/tasks", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const updated = tasks.map((t) =>
      t._id === result.draggableId
        ? { ...t, status: result.destination.droppableId }
        : t
    );

    setTasks(updated);

    await API.put(
      `/tasks/${result.draggableId}`,
      { status: result.destination.droppableId },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
  };

  const columns = {
    pending: tasks.filter((t) => t.status === "pending"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-6">
        {Object.keys(columns).map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                className="bg-gray-100 p-4 rounded min-h-[400px]"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-xl font-bold capitalize mb-2">
                  {col.replace("-", " ")}
                </h2>

                {columns[col].map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        className="bg-white p-3 shadow mb-2 rounded"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h3 className="font-bold">{task.title}</h3>
                        <p>{task.description}</p>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
