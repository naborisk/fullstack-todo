'use client'
import { useState, useEffect } from 'react'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface Todo {
  id: number
  title: string
  description: string
}

export default function Home() {
  const [data, setData] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/todos')
      .then(response => response.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  const addTodo = () => {
    fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(res => {
        setData([...data, res])
      })

    setTitle('')
    setDescription('')
    setDialogOpen(false)
  }

  const deleteTodo = (id: number) => {
    fetch(`api/todos/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setData(data.filter(todo => todo.id !== id))
    })
  }

  return (
    <div className="container mx-auto flex flex-col gap-2 py-4">
      {data.map((todo: Todo) => {
        return (
          <Card
            key={todo.id}
            className="p-4"
          >
            <div className="flex items-center">
              <div className="flex flex-col">
                <CardTitle>{todo.title}</CardTitle>
                <CardDescription>{todo.description}</CardDescription>
              </div>
              <Button
                className="ml-auto"
                onClick={() => deleteTodo(todo.id)}
                variant="destructive"
              >
                X
              </Button>
            </div>
          </Card>
        )
      })}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Todo</DialogTitle>
          </DialogHeader>
          <DialogDescription>Add a new todo</DialogDescription>
          <Input
            value={title}
            onChange={e => {
              setTitle(e.target.value)
            }}
            onKeyDown={e => e.key.toLowerCase() === 'enter' && addTodo()}
            placeholder="Title"
          />
          <Input
            value={description}
            onChange={e => {
              setDescription(e.target.value)
            }}
            onKeyDown={e => e.key.toLowerCase() === 'enter' && addTodo()}
            placeholder="Description"
          />

          <DialogFooter>
            <Button
              onClick={addTodo}
              variant="outline"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
