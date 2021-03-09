import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Formik } from "formik";
import React, { FC } from "react";
import { useIsMounted } from "../hooks/useIsMounted";
import { useThunkDispatch } from "../hooks/useThunkDispatch";
import { useTimeout } from "../hooks/useTimeout";
import { createWorkspace } from "../store/thunks";
import FormikInput from "./FormikInputs/FormikInput";
import { FormikSubmit } from "./FormikInputs/FormikSubmit";
import StyledForm from "./FormikInputs/StyledForm";

export const NewWorkspaceModal: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const dispatch = useThunkDispatch();
  const isMounted = useIsMounted();
  const { startTimeout } = useTimeout(() => {
    if (isMounted.current) onClose();
  }, 2000);
  return (
    <>
      <Button
        onClick={onOpen}
        variant="outline"
        leftIcon={<AddIcon />}
        colorScheme="teal"
        size="md">
        Create new workspace
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new workspace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: "" }}
              onSubmit={(workspace, actions) => {
                dispatch(createWorkspace(workspace)).then(() => {
                  toast({
                    title: "Workspace created",
                    isClosable: true,
                    status: "success",
                    duration: 15000,
                  });
                  if (isMounted.current) {
                    actions.setSubmitting(false);
                    startTimeout();
                  }
                });
              }}>
              <StyledForm display="flex" flexDir="column">
                <VStack spacing="2" alignItems="start">
                  <FormikInput formik_name="name" labelText="Workspace Name" />
                  <FormikSubmit colorScheme="teal">
                    Create Workspace
                  </FormikSubmit>
                </VStack>
              </StyledForm>
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
