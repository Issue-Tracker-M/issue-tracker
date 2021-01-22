import React from 'react'
import {
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  FormErrorMessage,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'
import * as yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useThunkDispatch } from '../../hooks/useThunkDispatch'
import { addWorkspace } from '../../store/thunks'

interface createWorkspaceModalProps {
  isOpen: boolean
  onClose(): any
}

export interface createWorkspaceObject {
  name: string
}

const CreateWorkspaceModal = ({
  isOpen,
  onClose
}: createWorkspaceModalProps) => {
  const dispatch = useThunkDispatch()
  const validationSchema = yup.object().shape({
    name: yup.string().label('name').required()
    // labels: yup.array().label('labels').required()
  })

  const initialValues: createWorkspaceObject = {
    name: ''
    // labels: []
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add WorkSpace</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              const payload = { name: values.name, labels: [] }
              dispatch(addWorkspace(payload))
              onClose()
            }}
            validationSchema={validationSchema}
          >
            <Form
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
              }}
            >
              <label htmlFor="name">
                {/* Name{' '} */}
                <Field name="name">
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Input
                        {...field}
                        id="name"
                        size="md"
                        variant="outline"
                        placeholder="Name"
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </label>

              <Button mt={4} variantColor="teal" type="submit">
                Create Workspace
              </Button>
            </Form>
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateWorkspaceModal
