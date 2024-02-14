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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Todo {
  id: number
  title: string
  description: string
  editMode: boolean
}

export default function Home() {
  const [data, setData] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/todos')
      .then(response => response.json())
      .then(data => {
        setData(
          data
            .map((todo: Todo) => ({ ...todo, editMode: false }))
            .sort((a: Todo, b: Todo) => a.id - b.id)
        )
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

  const updateTodo = (id: number, title: string, description: string) => {
    fetch(`api/todos`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        title,
        description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      const newData = data.map(t => {
        if (t.id === id) {
          return { ...t, title, description, editMode: !t.editMode }
        }
        return t
      })
      setData(newData)
    })
  }

  const deleteTodo = (id: number) => {
    fetch(`api/todos/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setData(data.filter(todo => todo.id !== id))
    })
  }

  return !loading ? (
    <div className='container mx-auto flex flex-col gap-2'>
      <div className='flex py-4'>
        <div className='flex items-center'>
          <h1 className='text-2xl'>Todo List</h1>
        </div>
        <div className='ml-auto'>
          <Avatar>
            <AvatarImage
              src='https://naborisk.com/img/profile.png'
              alt='@shadcn'
            />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
        </div>
      </div>
      {data.map((todo: Todo) => {
        return !todo.editMode ? (
          <Card key={todo.id} className='p-4'>
            <div className='flex items-center'>
              <div className='flex flex-col'>
                <CardTitle>{todo.title}</CardTitle>
                <CardDescription>{todo.description}</CardDescription>
              </div>
              <div className='ml-auto flex gap-2'>
                <Button
                  onClick={() => {
                    const newData = data.map(t => {
                      if (t.id === todo.id) {
                        return { ...t, editMode: !t.editMode }
                      }
                      return t
                    })
                    setData(newData)
                  }}
                  variant='outline'
                >
                  edit
                </Button>
                <Button
                  onClick={() => deleteTodo(todo.id)}
                  variant='destructive'
                >
                  X
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card
            key={todo.id}
            onKeyDown={e =>
              e.key.toLowerCase() === 'enter' &&
              updateTodo(todo.id, todo.title, todo.description)
            }
            className='p-4'
          >
            <div className='flex items-center'>
              <div className='flex flex-col gap-2'>
                <Input
                  value={todo.title}
                  onChange={e => {
                    const newData = data.map(t => {
                      if (t.id === todo.id) {
                        return { ...t, title: e.target.value }
                      }
                      return t
                    })
                    setData(newData)
                  }}
                />
                <Input
                  value={todo.description}
                  onChange={e => {
                    const newData = data.map(t => {
                      if (t.id === todo.id) {
                        return { ...t, description: e.target.value }
                      }
                      return t
                    })
                    setData(newData)
                  }}
                />
              </div>
              <div className='ml-auto flex gap-2'>
                <Button
                  onClick={() => {
                    updateTodo(todo.id, todo.title, todo.description)
                  }}
                  variant='outline'
                >
                  ✓
                </Button>
                <Button
                  onClick={() => {
                    const newData = data.map(t => {
                      if (t.id === todo.id) {
                        return { ...t, editMode: !t.editMode }
                      }
                      return t
                    })
                    setData(newData)
                  }}
                  variant='outline'
                >
                  X
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'>Add</Button>
        </DialogTrigger>
        <DialogContent
          onKeyDown={e => e.key.toLowerCase() === 'enter' && addTodo()}
        >
          <DialogHeader>
            <DialogTitle>Add Todo</DialogTitle>
          </DialogHeader>
          <DialogDescription>Add a new todo</DialogDescription>
          <Input
            value={title}
            onChange={e => {
              setTitle(e.target.value)
            }}
            placeholder='Title'
          />
          <Input
            value={description}
            onChange={e => {
              setDescription(e.target.value)
            }}
            placeholder='Description'
          />

          <DialogFooter>
            <Button onClick={addTodo} variant='outline'>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='text-3xl'>Loading...</div>
    </div>
  )
}
