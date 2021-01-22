import React, { useState } from 'react'
import {
  Box,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button
} from '@chakra-ui/react'
import ListCard from './listCard'

const data = {
  lists: [
    {
      id: '0',
      title: 'Sleep',
      description: 'Things I want to do',
      due_date: 'some date',
      priority: 'High',
      column: 'To do'
    },
    {
      id: '1',
      title: 'Work',
      description: 'Things I dont want to do',
      due_date: 'some date',
      priority: 'High',
      column: 'In Progress'
    },
    {
      id: '2',
      title: 'Dance',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'Completed'
    },
    {
      id: '3',
      title: 'Party',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'Completed'
    },
    {
      id: '4',
      title: 'Do laundry',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'Completed'
    },
    {
      id: '5',
      title: 'Search for round humans',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'Completed'
    },
    {
      id: '6',
      title: 'Fight dinosaurs',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'In Progress'
    },
    {
      id: '7',
      title: 'Kill villains',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'To do'
    },
    {
      id: '8',
      title: 'Dance some more',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'Completed'
    },
    {
      id: '9',
      title: 'Dance a bit more',
      description: 'Things I might do',
      due_date: 'some date',
      priority: 'High',
      column: 'Completed'
    }
  ]
}

interface ColumnProps {
  text: string
  index: number
  id: string
}

const ListColumn = ({ text, index, id }: ColumnProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Box
      minWidth="100%"
      display={{ md: 'flex' }}
      flexDirection={{ md: 'column' }}
      marginBottom={{ md: 12 }}
    >
      <Text mb={2} fontWeight="bold" fontSize="md">
        {text}
      </Text>
      {data.lists.map((task, i) =>
        task.column === text ? (
          <ListCard
            title={task.title}
            priority={task.priority}
            key={task.id}
            due_date={task.due_date}
            description={task.description}
          />
        ) : null
      )}
      <Text
        color="grey"
        mt={3}
        ml={3}
        cursor="pointer"
        onClick={() => setOpen(true)}
        mb={2}
        fontSize="sm"
      >
        Add Task...
      </Text>
      <Drawer
        isOpen={open}
        placement="right"
        onClose={() => setOpen(false)}
        size="md"
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>

          <DrawerBody></DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default ListColumn
