'use client'

import { useState } from "react";

export default function Home() {
  const [task, setTask]= useState('')
  
  return (
    <div className="flex justify-center pt-15">
      <input
      placeholder="type task"
      value={task}
      onChange={(e)=> setTask(e.target.value)}
      ></input>
    </div>
  );
}
