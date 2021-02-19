import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Formik } from "formik";
import React, { FC } from "react";
import FormikInput from "../FormikInputs/FormikInput";
import { FormikSubmit } from "../FormikInputs/FormikSubmit";
import StyledForm from "../FormikInputs/StyledForm";

const InviteMember: FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const toast = useToast();
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          colorScheme="teal"
          size="sm"
          justifySelf="end">
          Invite new members
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="600">
          Who do you want to invite?
        </PopoverHeader>
        <PopoverBody>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              axios
                .post(`/workspaces/${workspaceId}/invite`, {
                  email: values.email,
                })
                .then(() => {
                  toast({
                    title: `Invite sent to ${values.email}`,
                    description:
                      "Invited user will be able to join this workspace once they click on the link in email",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                  resetForm();
                })
                .catch((err: unknown) => {
                  toast({
                    title: "Unable to send invite",
                    description: `We couldn't send an invite to ${values.email}, try again later`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                  console.log(err);
                })
                .finally(() => setSubmitting(false));
            }}>
            <StyledForm>
              <FormikInput
                formik_name="email"
                labelText="Email"
                type="email"
                isRequired
                placeholder="Enter their email"
              />
              <FormikSubmit
                size="sm"
                width="100%"
                colorScheme="teal"
                mt="2"
                variant="outline">
                Send Invitation
              </FormikSubmit>
            </StyledForm>
          </Formik>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(InviteMember);
