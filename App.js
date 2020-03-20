import React, { useState, useEffect } from 'react';
import './App.css';
import { firestore } from './index'
import Task from './Task'


function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "do homework" },
    { id: 2, name: "write node js" }
  ])

  const [name, setName] = useState('')

  useEffect(() => {
    retriveData()
  }, [])

  const retriveData = () => {
    firestore.collection("tasks").onSnapshot((snapshot) => {
      console.log(snapshot.docs)
      let myTask = snapshot.docs.map(d => {
        const { id, name } = d.data()
        console.log(id, name)
        return { id, name }
      })
      setTasks(myTask)
    })
  }

  const addTask = () => {
    let id = (tasks.length === 0) ? 1 : tasks[tasks.length - 1].id + 1
    firestore.collection("tasks").doc(id + '').set({ id, name })
}

  const deleteTask = (id) => {
    firestore.collection("tasks").doc(id + '').delete()
  }

  const editTask = (id) => {
    firestore.collection("tasks").doc(id + '').set({ id, name })
  }
  const renderTask = () => {
    if (tasks && tasks.length)
      return tasks.map((task, index) => {
        return (
          <Task key={index} task={task}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        )
      })
    else
      return (<li> No Task </li>)
  }
  

  return (
    <div className="App-header"  >
      <h1 > Todo Work do you want </h1>
      <input  type="text" name="name" onChange={(e) => setName(e.target.value)} />
      <button style={{ backgroundColor: 'pink' }} onClick={addTask}> Submit </button>
      <ul style={{ display: 'flex', listStyle: 'none'}}>{renderTask()}</ul>

    </div>
  );
}

export default App;
